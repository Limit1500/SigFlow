import net from "node:net";
import framer from "../clientProtocol/framer.js";
import authClient from "../middlewares/auth/clients.js";
import parser from "../clientProtocol/parser.js";
import type { ParsedCommands } from "../clientProtocol/config.commands.js";
import handleTask from "../services/configCommands.service.js";

const server = net.createServer((socket) => {
  let token = "";

  socket.write("Insert authentification token: ");

  socket.on("data", async (data: Buffer) => {
    console.log(data);

    const message = framer(data);

    if (token === "") {
      token = message;
    }
    const { userId: number } = await authClient(token);
    const task: ParsedCommands = parser(message);
    handleTask(task, userId);
  });

  socket.on("connect", () => {
    console.log("Client connected");
  });

  socket.on("end", () => {
    console.log("Client disconnected");
  });

  socket.on("error", () => {
    console.log("An error occured");
  });
});

server.listen(process.env.CLIENT_PORT, () => {
  console.log(`TCP server listening on port ${process.env.CLIENT_PORT}`);
});
