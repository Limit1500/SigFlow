import net from "node:net";
import readline from "node:readline";

const socket = net.createConnection({
  host: "localhost",
  port: Number(process.env.CLIENT_PORT),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "sigflow> ",
});

let authenticated = false;

socket.on("connect", () => {
  console.log("Connected to SigFlow");
});

rl.on("line", (input: string) => {
  socket.write(`${input}\n`);
});

socket.on("data", (data: Buffer) => {
  const message = data.toString();

  process.stdout.write(message);

  if (!authenticated && message.includes("Authentication successful")) {
    authenticated = true;
    rl.setPrompt("sigflow> ");
  }

  rl.prompt();
});

socket.on("close", () => {
  console.log("Disconnected");
  rl.close();
});

socket.on("error", (error) => {
  console.error("Connection error:", error.message);
  rl.close();
});
