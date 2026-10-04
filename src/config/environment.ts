const requiredVariables = [
  "DATABASE_URL",
  "SSO_HOSTNAME",
  "CLIENT_PORT",
  "MICROSERVICES_PORT",
  "SSO_CLIENT_PORT",
  "BROKER_NAME",
  "BROKER_SECRET",
  "SSO_USER_PORT",
] as const;

export function validateEnvironmentVariables(): void {
  for (const variable of requiredVariables) {
    if (!process.env[variable]) {
      throw new Error(`Missing environment variable: ${variable}`);
    }
  }
}
