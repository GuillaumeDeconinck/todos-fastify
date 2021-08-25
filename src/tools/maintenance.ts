import { delay, inject, singleton } from "tsyringe";
import { PostgresPool } from "../infrastructure/postgres";
import { RestServer } from "../rest";
import { Logger } from "./logger";

// 5s
const GRACE_TIMEOUT = 5000;

@singleton()
export class Maintenance {
  private isReady: boolean;
  private isHealthy: boolean;

  constructor(
    @inject(Logger) private logger: Logger,
    @inject(delay(() => RestServer)) private restServer: RestServer,
    @inject(delay(() => PostgresPool)) private pgPool: PostgresPool
  ) {
    this.isReady = false;
    // TODO: reswitch to false at startup
    this.isHealthy = true;

    this.signalHandler = this.signalHandler.bind(this);
  }

  setIsReady(isReady: boolean): void {
    this.isReady = isReady;
  }

  getIsReady(): boolean {
    return this.isReady;
  }

  // TODO: currently not used
  setIsHealthy(isHealthy: boolean): void {
    this.isHealthy = isHealthy;
  }

  getIsHealthy(): boolean {
    return this.isHealthy;
  }

  setupSignalHandler(): void {
    process.once("SIGINT", this.signalHandler);
    process.once("SIGTERM", this.signalHandler);
    // SIGUSR2 is used by nodemon to notify restart
    process.once("SIGUSR2", this.signalHandler);
  }

  private async signalHandler(signal: string): Promise<void> {
    this.logger.logger.info(`[MAINT] ${signal} received`);

    // Set a timeout in case of extra long `*.close()`
    const timeOutHandler = setTimeout(() => {
      this.logger.logger.info("[MAINT] Timeout reached, brutally exiting");
      process.exit(1);
    }, GRACE_TIMEOUT);

    try {
      await this.restServer.closeRestServer();
      await this.pgPool.close();
      clearTimeout(timeOutHandler);
      this.logger.logger.info("[MAINT] Everything closed successfully, exiting...");
      process.exit(0);
    } catch (error) {
      this.logger.logger.error(`[MAINT] Error while closing services following a ${signal}`);
      this.logger.logger.error(error);
      clearTimeout(timeOutHandler);
      process.exit(1);
    }
  }
}
