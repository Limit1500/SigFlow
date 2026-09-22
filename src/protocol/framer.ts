import { config } from "process";
import parser from "./parser.js";
import ConfigService from "../config.service.js";

function framer(data: Buffer, state: string) {
  for (const byte of data) {
    const char = String.fromCharCode(byte as number);
    if (char === "\n") {
      const task = parser(state);
      ConfigService.handleTask(task);

      state = "";
    } else if (char !== "\r") {
      state += char;
    }
  }

  return state;
}

export default framer;
