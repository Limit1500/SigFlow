import net from "node:net";
import framer from "./protocol/framer.js";

const server = net.createServer((socket) => {
  let state = "";

  socket.on("data", (data: Buffer) => {
    try {
      console.log(data);
      state = framer(data, state);
    } catch (error) {
      socket.write(
        `ERROR ${error instanceof Error ? error.message : "UNKNOWN_ERROR"}\n`,
      );
    }
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

server.listen(4000, () => {
  console.log("TCP server listening on port 4000");
});
