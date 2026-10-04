import net from "node:net";
import authClient from "../middlewares/auth/clients.js";
import type { ConfigCommands } from "../clientProtocol/commands.types.js";
import { validateToken } from "../validation/string.js";
import { handleConfigTask } from "../clientProtocol/commands.service.js";
import { configParser } from "../clientProtocol/parser.service.js";

export default function startClientServer() {
  const server = net.createServer((socket) => {
    let userId: number | null = null;

    console.log("Client connected");
    socket.write("Insert authentification token: ");

    socket.on("data", async (data: Buffer) => {
      try {
        if (userId === null) {
          const token = validateToken(data);
          userId = await authClient(token);

          socket.write("Authentication successful.\n");
        } else {
          const message = data.toString().trim();
          const task: ConfigCommands = configParser(message);
          await handleConfigTask(task, userId);
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
