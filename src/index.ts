import "reflect-metadata";
import { container } from "tsyringe";
import { AppConfiguration } from "./tools/config";
import { Logger } from "./tools/logger";
import { RestServer } from "./rest";
import { PostgresPool } from "./infrastructure/postgres";
import { Maintenance } from "./tools/maintenance";

(async () => {
  try {
    const appConfiguration = container.resolve(AppConfiguration);
    appConfiguration.initialize();

    const logger = container.resolve(Logger).logger;
    logger.info("[STARTUP] Config loaded and logger configured");

    const maintenance = container.resolve(Maintenance);
    maintenance.setupSignalHandler();
    logger.info("[STARTUP] Maintenance handler initialized");

    // Connect to PGSQL
    const pgPool = container.resolve(PostgresPool);
    await pgPool.connect();
    logger.info("[STARTUP] Postgres pool connected");

    // Setup Rest server
    const restServer = container.resolve(RestServer);
    await restServer.setupRest();
    logger.info(`[STARTUP] Rest server started on port ${appConfiguration.getAppConfig().apiPort}`);

    // Set the service as ready
    maintenance.setIsReady(true);
  } catch (error) {
    try {
      const logger = container.resolve(Logger).logger;
      logger.error(error);
    } catch (unexpectedError) {
      // eslint-disable-next-line no-console
      console.error(unexpectedError);
    }
    process.exit(1);
  }
})();
