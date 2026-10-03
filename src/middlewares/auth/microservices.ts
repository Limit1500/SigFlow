import DatabaseService from "../../database/database.service.js";

async function authMicroservice(
  name: string,
  secret: string
): Promise<number | null> {
  const response = await DatabaseService.getMicroservice(name, secret);

  if (!response) {
    return null;
  } else {
    return response.id;
  }
}

export default authMicroservice;
