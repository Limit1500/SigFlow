import type { ParsedCommands } from "../clientProtocol/commands.types.js";
import { connectedMicroservices } from "../servers/microservice.server.js";
import DatabaseService from "../database/database.service.js";

async function handleTask(task: ParsedCommands, userId: number) {
  if (task.type === "BROKER") {
    switch (task.command) {
      case "CREATE_EVENT":
        return DatabaseService.createEvent(task.eventName, userId);

      case "ASSIGN_MICROSERVICE":
        return DatabaseService.linkMicroserviceToEvent(
          task.microserviceName,
          task.eventName,
          userId
        );

      case "CREATE_MICROSERVICE":
        return DatabaseService.createMicroservice(
          task.microserviceName,
          task.microserviceSecret,
          userId
        );

      case "DELETE_MICROSERVICE":
        return DatabaseService.deleteMicroservice(
          task.microserviceName,
          userId
        );

      case "DELETE_EVENT":
        return DatabaseService.deleteEvent(task.eventName, userId);
    }
  }

  const linkedMicroservices = await DatabaseService.getCommandMicroservices(
    task.command,
    userId
  );

  for (const microservice of linkedMicroservices) {
    if (!connectedMicroservices.has(microservice.id)) {
      throw new Error("Not all microservices are connected");
    }
  }

  for (const microservice of linkedMicroservices) {
    const socket = connectedMicroservices.get(microservice.id)!;
    socket.write(`${task.command} ${task.eventInfo}\n`);
  }
}

export default handleTask;
