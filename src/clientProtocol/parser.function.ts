import type { ParsedCommands } from "./commands.types.js";

function parser(data: string): ParsedCommands {
  const parts = data.split(" ");

  if (parts.length < 2) {
    throw new Error();
  }

  const command = parts.shift();
  const identifier = parts.shift()!;

  if (command === "CREATE_EVENT") {
    if (parts.length < 1) {
      throw new Error();
    }
    const data = parts.join(" ");

    return {
      type: "BROKER",
      command,
      eventName: identifier,
    };
  } else if (command === "ASSIGN_MICROSERVICE") {
    if (parts.length !== 1) {
      throw new Error();
    }
    return {
      type: "BROKER",
      command,
      microserviceName: identifier,
      eventName: parts[0]!,
    };
  } else if (command === "CREATE_MICROSERVICE") {
    if (parts.length !== 1) {
      throw new Error();
    }
    return {
      type: "BROKER",
      command,
      microserviceName: identifier,
      microserviceSecret: parts[0]!,
    };
  } else if (command === "DELETE_MICROSERVICE") {
    if (parts.length !== 0) {
      throw new Error();
    }
    return {
      type: "BROKER",
      command,
      microserviceName: identifier,
    };
  } else if (command === "DELETE_EVENT") {
    if (parts.length !== 0) {
      throw new Error();
    }
    return {
      type: "BROKER",
      command,
      eventName: identifier,
    };
  } else {
    const [command, ...eventInfo] = data.split(" ");
    return {
      type: "USER",
      command: command!,
      eventInfo: eventInfo.join(" "),
    };
  }
}

export default parser;
