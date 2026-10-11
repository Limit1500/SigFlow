import net from "node:net";
import authClient from "../middlewares/auth/clients.js";
import type { ConfigCommands } from "../clientProtocol/commands.types.js";
import { validateToken } from "../validation/string.js";
import { handleConfigTask } from "../clientProtocol/commands.service.js";
import { configParser } from "../clientProtocol/parser.service.js";
import DatabaseService from "../database/database.service.js";

export default function startClientServer() {
  const server = net.createServer((socket) => {
    let clientId: number | null = null;

    console.log("Client connected");
    socket.write("Insert authentification token: ");

    socket.on("data", async (data: Buffer) => {
      try {
        if (clientId === null) {
          const token = validateToken(data);
          clientId = await authClient(token);

          if (!(await DatabaseService.getClientById(clientId))) {
            await DatabaseService.createClient(clientId);
          }
          console.log("Client authentificated");
          socket.write("Authentication successful\n");
        } else {
          const message = data.toString().trim();
          const task: ConfigCommands = configParser(message);
          await handleConfigTask(task, clientId);
          socket.write("Executed\n");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          socket.write(`Error: ${error.message}\n`);
        } else {
          socket.write("Error: Unknown error\n");
        }
      }
    });

    socket.on("end", () => {
      console.log("Client disconnected");
    });

    socket.on("error", (error) => {
      console.error("Client connection error:", error.message);
    });
  });

  server.listen(process.env.CLIENT_PORT, () => {
    console.log(`TCP server listening on port ${process.env.CLIENT_PORT}`);
  });
}
