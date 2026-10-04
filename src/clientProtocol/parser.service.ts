import type { ConfigCommands, FlagCommand } from "./commands.types.js";

export function configParser(data: string): ConfigCommands {
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
        command,
        eventName: identifier,
      };
    }

    case "ASSIGN_MICROSERVICE": {
      if (args.length !== 1) {
        throw new Error("Expected one event name");
      }

      return {
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
            command,
            eventName: identifier,
          }
        : {
            command,
            microserviceName: identifier,
          };
    }

    default:
      throw new Error(`Unknown command: ${command}`);
  }
}

export function flagParser(data: string): FlagCommand {
  const [command, identifier, ...args] = data.trim().split(/\s+/);

  if (!command || !identifier) {
    throw new Error("Invalid command syntax");
  }

  return {
    command,
    eventInfo: [identifier, ...args].join(" "),
  };
}
