import net from "node:net";
import authMicroservice from "../middlewares/auth/microservices.js";
import { validateCredentials } from "../validation/string.js";
import { flagParser } from "../clientProtocol/parser.service.js";
import { handleFlagTask } from "../clientProtocol/commands.service.js";
import type { FlagCommand } from "../clientProtocol/commands.types.js";
import DatabaseService from "../database/database.service.js";

export const connectedMicroservices = new Map<number, net.Socket>();

export function startMicroservicesServer() {
  const server = net.createServer((socket) => {
    let microserviceId: number | null = null;

    console.log("New microservice connection");

    socket.write("Insert your credentials:\n");

    const removeMicroservice = () => {
      if (microserviceId !== null) {
        connectedMicroservices.delete(microserviceId);
      }
    };

    socket.on("data", async (data: Buffer) => {
      try {
        if (microserviceId === null) {
          const [name, secret] = validateCredentials(data);

          const authenticatedId = await authMicroservice(name, secret);

          if (authenticatedId === null) {
            throw new Error("Microservice not found");
          }

          microserviceId = authenticatedId;

          connectedMicroservices.set(microserviceId, socket);
        } else {
          const message = data.toString().trim();
          const task: FlagCommand = flagParser(message);
          const userId = await DatabaseService.getClientIdByMicroservice(
            microserviceId
          );
          await handleFlagTask(task, userId);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("Unknown error:", error);
        }

        socket.destroy();
      }
    });

    socket.on("close", () => {
      console.log("Microservice disconnected");
      removeMicroservice();
    });

    socket.on("error", (error) => {
      console.error("Microservice connection error:", error);
      removeMicroservice();
    });
  });

  server.listen(process.env.MICROSERVICES_PORT, () => {
    console.log(
      `Microservice server is listening on ${process.env.MICROSERVICES_PORT}`
    );
  });
}
