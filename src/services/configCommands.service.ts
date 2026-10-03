import type { ParsedCommands } from "../clientProtocol/commands.types.js";
import { connectedMicroservices } from "../servers/microservice.server.js";
import DatabaseService from "../database/database.service.js";

async function handleTask(task: ParsedCommands, userId: number) {
  if (task.type === "BROKER") {
    if (task.command === "CREATE_EVENT") {
      return await DatabaseService.createEvent(task.eventName, userId);
    } else if (task.command === "ASSIGN_MICROSERVICE") {
      return await DatabaseService.linkMicroserviceToEvent(
        task.microserviceName,
        task.eventName,
        userId
      );
    } else if (task.command === "CREATE_MICROSERVICE") {
      return await DatabaseService.createMicroservice(
        task.microserviceName,
        task.microserviceSecret,
        userId
      );
    } else if (task.command === "DELETE_MICROSERVICE") {
      return await DatabaseService.deleteMicroservice(
        task.microserviceName,
        userId
      );
    } else {
      return await DatabaseService.deleteEvent(task.eventName, userId);
    }
  } else {
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
      const socket = connectedMicroservices.get(microservice.id);
      socket!.write(`${task.command} ${task.eventInfo}\n`);
    }
  }
}

export default handleTask;
