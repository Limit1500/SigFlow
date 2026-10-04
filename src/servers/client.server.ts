import net from "node:net";
import authClient from "../middlewares/auth/clients.js";
import parser from "../clientProtocol/parser.function.js";
import type { ParsedCommands } from "../clientProtocol/commands.types.js";
import handleTask from "../services/configCommands.service.js";
import { validateToken } from "../validation/string.js";

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
          const task: ParsedCommands = parser(message);
          await handleTask(task, userId);
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
