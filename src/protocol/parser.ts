import type { ParsedCommands } from "./config.commands.js";

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
      command,
      eventName: identifier,
      data,
    };
  } else if (command === "ASSIGN_MICROSERVICE") {
    if (parts.length !== 1) {
      throw new Error();
    }
    return {
      command,
      microserviceName: identifier,
      eventName: parts[0]!,
    };
  } else if (command === "REGISTER_MICROSERVICE") {
    if (parts.length !== 1) {
      throw new Error();
    }
    return {
      command,
      microserviceName: identifier,
      microserviceSecret: parts[0]!,
    };
  } else if (command === "DELETE_MICROSERVICE") {
    if (parts.length !== 0) {
      throw new Error();
    }
    return {
      command,
      microserviceName: identifier,
    };
  } else if (command === "DELETE_EVENT") {
    if (parts.length !== 0) {
      throw new Error();
    }
    return {
      command,
      eventName: identifier,
    };
  } else {
    throw new Error();
  }
}

export default parser;
