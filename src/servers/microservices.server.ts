import net from "node:net";

const server = net.createServer((socket) => {
  socket.on("connect", () => {
    console.log("Microservice connected");
  });

  socket.on("close", () => {
    console.log("Microservice disconnected");
  });

  socket.on("error", () => {
    console.log("Microservice connection error");
  });
});

server.listen(process.env.MICROSERVICES_PORT, () => {
  console.log(
    `Microservice server is listening on ${process.env.MICROSERVICES_PORT}`
  );
});
