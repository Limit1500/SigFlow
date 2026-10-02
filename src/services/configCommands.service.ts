import type { ParsedCommands } from "../clientProtocol/config.commands.js";
import DatabaseService from "./database.service.js";

async function handleTask(task: ParsedCommands, userId: number) {
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
}

export default handleTask;
