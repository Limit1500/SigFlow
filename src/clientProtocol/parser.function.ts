import type { ParsedCommands } from "./commands.types.js";

function parser(data: string): ParsedCommands {
  const [command, identifier, ...args] = data.trim().split(/\s+/);

  if (!command || !identifier) {
    throw new Error("Invalid command syntax");
  }

  switch (command) {
    case "CREATE_EVENT": {
      if (args.length === 0) {
        throw new Error("Event data is required");
      }

      return {
        type: "BROKER",
        command,
        eventName: identifier,
      };
    }

    case "ASSIGN_MICROSERVICE": {
      if (args.length !== 1) {
        throw new Error("Expected one event name");
      }

      return {
        type: "BROKER",
        command,
        microserviceName: identifier,
        eventName: args[0]!,
      };
    }

    case "CREATE_MICROSERVICE": {
      if (args.length !== 1) {
        throw new Error("Expected one microservice secret");
      }

      return {
        type: "BROKER",
        command,
        microserviceName: identifier,
        microserviceSecret: args[0]!,
      };
    }

    case "DELETE_MICROSERVICE":
    case "DELETE_EVENT": {
      if (args.length !== 0) {
        throw new Error("Unexpected arguments");
      }

      return command === "DELETE_EVENT"
        ? {
            type: "BROKER",
            command,
            eventName: identifier,
          }
        : {
            type: "BROKER",
            command,
            microserviceName: identifier,
          };
    }

    default:
      return {
        type: "USER",
        command,
        eventInfo: [identifier, ...args].join(" "),
      };
  }
}

export default parser;
