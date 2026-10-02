import net from "node:net";
import { publicKeyService } from "../publicKeys/publicKey.service.js";

const socket = net.createConnection({
  host: process.env.SSO_HOSTNAME,
  port: Number(process.env.SSO_PORT),
});

const credentials = {
  name: process.env.BROKER_NAME,
  secret: process.env.BROKER_SECRET,
};

socket.on("connect", () => {
  socket.write(JSON.stringify(credentials));
});

socket.on("data", (data) => {
  const publicKeys = JSON.parse(data.toString());
  publicKeyService.setKeys(publicKeys);
});

socket.on("error", () => {
  console.log("Error occured: SSO is not connected");
});

socket.on("close", () => {
  console.log("SSO connection closed");
});
