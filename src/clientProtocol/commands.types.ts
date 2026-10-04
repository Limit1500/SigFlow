export type ConfigCommands =
  | {
      command: "CREATE_EVENT";
      eventName: string;
    }
  | {
      command: "ASSIGN_MICROSERVICE";
      microserviceName: string;
      eventName: string;
    }
  | {
      command: "CREATE_MICROSERVICE";
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

export type FlagCommand = {
  command: string;
  eventInfo: string;
};
