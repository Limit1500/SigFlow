import { validateEnvironmentVariables } from "./config/environment.js";
import startClientServer from "./servers/client.server.js";
import { startMicroservicesServer } from "./servers/microservice.server.js";
import connectToSSO from "./sso/sso.connection.js";

function startApplication() {
  validateEnvironmentVariables();

  startClientServer();
  startMicroservicesServer();
  connectToSSO();
}

try {
  startApplication();
} catch (error) {
  console.error("Application startup failed:", error);
  process.exit(1);
}
