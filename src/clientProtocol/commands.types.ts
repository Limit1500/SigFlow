export type ParsedCommands =
  | {
      type: "BROKER";
      command: "CREATE_EVENT";
      eventName: string;
    }
  | {
      type: "BROKER";
      command: "ASSIGN_MICROSERVICE";
      microserviceName: string;
      eventName: string;
    }
  | {
      type: "BROKER";
      command: "CREATE_MICROSERVICE";
      microserviceName: string;
      microserviceSecret: string;
    }
  | {
      type: "BROKER";
      command: "DELETE_MICROSERVICE";
      microserviceName: string;
    }
  | {
      type: "BROKER";
      command: "DELETE_EVENT";
      eventName: string;
    }
  | {
      type: "USER";
      command: string;
      eventInfo: string;
    };
