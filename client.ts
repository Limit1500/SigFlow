import net from "node:net";
import readline from "node:readline";

const socket = net.createConnection({
  host: "localhost",
  port: 4000,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "sigflow> ",
});

socket.on("connect", () => {
  console.log("Connected to SigFlow");
  rl.prompt();
});

rl.on("line", (input) => {
  socket.write(input + "\n");
  rl.prompt();
});

socket.on("data", (data) => {
  process.stdout.write(data.toString());
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
