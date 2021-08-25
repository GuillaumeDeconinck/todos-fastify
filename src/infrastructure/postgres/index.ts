import { inject, injectable, singleton } from "tsyringe";
import { AppConfiguration } from "../../tools/config";
import { Logger } from "../../tools/logger";
// Import the DAOs in order for the @registry to be correctly taken into account
import "./todos/todos.dao";
import { Connection, ConnectionOptions, createConnection, EntityTarget, Repository } from "typeorm";
import { Todo } from "../../domain/models/Todo";
import _ from "lodash";

@singleton()
@injectable()
export class PostgresPool {
  private pool: Connection;

  constructor(
    @inject(AppConfiguration) private configuration: AppConfiguration,
    @inject(Logger) private logger: Logger
  ) {}

  async connect(): Promise<void> {
    const config: ConnectionOptions = {
      type: "postgres",
      ...this.configuration.getPGConfig(),
      entities: [Todo],
      extra: {
        connectionLimit: 5
      },
      synchronize: true, // Ideally shouldn't be used in prod
      logging: ["error"]
    };

    if (config.ssl) {
      // Using this hack as `ssl` key is readonly
      _.assign(config, { ssl: { rejectUnauthorized: false } });
    }

    this.pool = await createConnection(config);
  }

  getClient(): Connection {
    return this.pool;
  }

  getRepository<T>(entity: EntityTarget<T>): Repository<T> {
    return this.pool.getRepository(entity);
  }

  async executeQuery<T>(queryName: string, query: string, params: unknown[]): Promise<T[]> {
    try {
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      this.logger.logger.error(`[PGSQL] Error while executing ${queryName}`);
      this.logger.logger.error(error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.pool) {
      this.pool.close();
    }
  }
}
