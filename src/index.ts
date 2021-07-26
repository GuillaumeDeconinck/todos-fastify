import "reflect-metadata";
import { container } from "tsyringe";
import { AppConfiguration } from "./tools/config";
import { Logger } from "./tools/logger";
import { RestServer } from "./rest";

(async () => {
  try {
    const appConfiguration = container.resolve(AppConfiguration);
    appConfiguration.initialize();

    const logger = container.resolve(Logger).logger;
    logger.info("[STARTUP] Config loaded and logger configured");

    // Setup Rest server
    const restServer = container.resolve(RestServer);
    await restServer.setupRest();
    logger.info(`[STARTUP] Rest server started on port ${appConfiguration.getAppConfig().apiPort}`);
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
