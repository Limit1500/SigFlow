import DatabaseService from "../../services/database.service.js";

async function authMicroservice(name: string, secret: string) {
  const response = await DatabaseService.getMicroservice(name, secret);

  if (response === null) {
    throw new Error("Invalid microservice credentials");
  }

  return response.id;
}

export default authMicroservice;
