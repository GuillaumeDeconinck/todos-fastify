import { inject, singleton } from "tsyringe";
import { PostgresPool } from "../infrastructure/postgres";
import { RestServer } from "../rest";
import { Logger } from "./logger";

// SIGUSR2 is used by nodemon to notify restart
const SIGNALS_TO_LISTEN = ["SIGINT", "SIGTERM", "SIGUSR2"];
// 5s
const GRACE_TIMEOUT = 5000;

@singleton()
export class Maintenance {
  private isHealthy: boolean;
  private isReady: boolean;

  constructor(
    @inject(Logger) private logger: Logger,
    @inject(RestServer) private restServer: RestServer,
    @inject(PostgresPool) private pgPool: PostgresPool
  ) {
    this.isHealthy = false;
    this.isReady = false;

    this.signalHandler = this.signalHandler.bind(this);
  }

  setIsReady(isReady: boolean): void {
    this.isReady = isReady;
  }

  getIsReady(): boolean {
    return this.isReady;
  }

  setIsHealthy(isHealthy: boolean): void {
    this.isHealthy = isHealthy;
  }

  getIsHealthy(): boolean {
    return this.isHealthy;
  }

  setupSignalHandler(): void {
    for (const signal of SIGNALS_TO_LISTEN) {
      process.once(signal, this.signalHandler);
    }
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
