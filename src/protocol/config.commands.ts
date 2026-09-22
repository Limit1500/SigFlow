export type ParsedCommands =
  | {
      command: "CREATE_EVENT";
      eventName: string;
      data: string;
    }
  | {
      command: "ASSIGN_MICROSERVICE";
      microserviceName: string;
      eventName: string;
    }
  | {
      command: "REGISTER_MICROSERVICE";
      microserviceName: string;
      microserviceSecret: string;
    }
  | {
      command: "DELETE_MICROSERVICE";
      microserviceName: string;
    }
  | {
      command: "DELETE_EVENT";
      eventName: string;
    };
