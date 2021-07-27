import * as postgres from "pg";
import DBMigrate from "db-migrate";
import { inject, injectable, singleton } from "tsyringe";
import { AppConfiguration } from "../../tools/config";
import { Logger } from "../../tools/logger";
// Import the DAOs in order for the @registry to be correctly taken into account
import "./todos/todos.dao";

// To be implemented, base class for Postgres
@singleton()
@injectable()
export class PostgresPool {
  private pool: postgres.Pool;

  constructor(
    @inject(AppConfiguration) private configuration: AppConfiguration,
    @inject(Logger) private logger: Logger
  ) {}

  async connect(): Promise<void> {
    this.pool = new postgres.Pool({
      ...this.configuration.getPGConfig(),
      min: 1,
      max: 5
    });

    // Check if pool works fine
    const client = await this.pool.connect();
    await client.query("SELECT NOW()");
    client.release();

    // Run migrations
    const dbMigrate = DBMigrate.getInstance(true, {
      env: this.configuration.getAppConfig().nodeEnv === "production" ? "kubernetes" : "localKube"
    });
    await dbMigrate.up();
  }

  async getClient(): Promise<postgres.PoolClient> {
    return await this.pool.connect();
  }

  async executeQuery<T>(queryName: string, query: string, params: unknown[]): Promise<T[]> {
    try {
      const client = await this.getClient();
      const result = await client.query(query, params);
      return result.rows;
    } catch (error) {
      this.logger.logger.error(`[PGSQL] Error while executing ${queryName}`);
      this.logger.logger.error(error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      this.pool.end();
    }
  }
}
