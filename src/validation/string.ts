export function validateCredentials(data: Buffer): [string, string] {
  const parts = data.toString().trim().split(" ");

  if (parts.length !== 2) {
    throw new Error("Invalid credentials");
  }

  const [name, secret] = parts;

  return [name!, secret!];
}

export function validateToken(data: Buffer): string {
  const token = data.toString().trim();

  if (!token || typeof token !== "string") {
    throw new Error("Token is required");
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Invalid JWT format");
  }

  return token;
}
