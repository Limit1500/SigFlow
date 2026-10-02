import prisma from "../db.js";

class DatabaseService {
  static async getMicroservice(name: string, secret: string) {
    return await prisma.Microservices.findUnique({
      where: {
        name_secret: {
          name,
          secret,
        },
      },
    });
  }

  static async createEvent(keyWord: string, userId: number) {
    return await prisma.Events.create({
      data: {
        keyWord,
        userId,
      },
    });
  }

  static async deleteEvent(keyWord: string, userId: number) {
    return await prisma.Events.delete({
      where: {
        userId_keyWord: {
          userId,
          keyWord,
        },
      },
    });
  }

  static async createMicroservice(
    name: string,
    secret: string,
    userId: number
  ) {
    return await prisma.Microservices.create({
      data: {
        name,
        secret,
        userId,
      },
    });
  }

  static async deleteMicroservice(name: string, userId: number) {
    return await prisma.Microservices.delete({
      where: {
        userId_name: {
          userId,
          name,
        },
      },
    });
  }

  static async linkMicroserviceToEvent(
    microserviceName: string,
    eventName: string,
    userId: number
  ) {
    return await prisma.Microservices.update({
      where: {
        userId_name: {
          userId,
          name: microserviceName,
        },
      },
      data: {
        events: {
          connect: {
            userId_keyWord: {
              userId,
              keyWord: eventName,
            },
          },
        },
      },
    });
  }
}

export default DatabaseService;
