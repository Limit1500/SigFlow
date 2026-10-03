export function validateMicroserviceCredentials(
  data: Buffer
): [string, string] {
  const parts = data.toString().trim().split(" ");

  if (parts.length !== 2) {
    throw new Error("Invalid credentials");
  }

  const [name, secret] = parts;

  return [name!, secret!];
}
