import net from "node:net";
import { publicKeyService } from "./publicKey.service.js";

export default function connectToSSO() {
  const socket = net.createConnection({
    host: process.env.SSO_HOSTNAME,
    port: Number(process.env.SSO_PORT),
  });

  const credentials = {
    name: process.env.BROKER_NAME,
    secret: process.env.BROKER_SECRET,
  };

  socket.on("connect", () => {
    socket.write(`${credentials.name} ${credentials.secret}\n`);
  });

  socket.on("data", (data) => {
    try {
      const publicKeys = JSON.parse(data.toString());

      publicKeyService.setKeys(publicKeys);
    } catch (error) {
      console.error("Invalid public keys received from SSO:", error);
    }
  });

  socket.on("error", (error) => {
    console.error("SSO connection error:", error.message);
  });

  socket.on("close", (hadError) => {
    console.log(
      `SSO connection closed${hadError ? " because of an error" : ""}`
    );
  });
}
