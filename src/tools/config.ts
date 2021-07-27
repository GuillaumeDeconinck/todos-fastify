import dotenv from "dotenv";
import { defaults } from "lodash";
import { injectable, singleton } from "tsyringe";

interface AppConfig {
  nodeEnv: string;
  logLevel: string;
  apiPort: number;
  apiJWTPublic: string;
  apiJWTIss: string;
  apiRateLimitTTL: number;
}

interface PGConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
}

@singleton()
@injectable()
export class AppConfiguration {
  private appConfig?: AppConfig;
  private pgConfig?: PGConfig;

  public initialize(): void {
    // Only used within pod to load env vars from Kube's secrets' file
    if (process.env.NODE_ENV && process.env.NODE_ENV !== "development") {
      dotenv.config({ path: "/etc/secrets/todos-backend-secrets" });
    }

    const baseConfig = {
      NODE_ENV: "development",
      LOG_LEVEL: "INFO",
      API_PORT: "9002",
      API_JWT_PUBLIC: "",
      API_JWT_ISS: "",
      API_RATE_LIMIT_TTL: "3600",
      PG_HOST: "localhost",
      PG_PORT: "5432",
      PG_USER: "root",
      PG_PASS: "root",
      PG_DB: "flows",
      PG_SSL: "false"
    };

    defaults(process.env, baseConfig);

    const {
      NODE_ENV,
      LOG_LEVEL,
      API_PORT,
      API_JWT_PUBLIC,
      API_JWT_ISS,
      API_RATE_LIMIT_TTL,
      PORT,
      PG_HOST,
      PG_PORT,
      PG_USER,
      PG_PASS,
      PG_DB,
      PG_SSL
    } = process.env;

    this.appConfig = {
      nodeEnv: NODE_ENV,
      logLevel: LOG_LEVEL,
      apiPort: parseInt(PORT || API_PORT, 10),
      apiJWTPublic: API_JWT_PUBLIC ? Buffer.from(API_JWT_PUBLIC, "base64").toString("utf-8") : API_JWT_PUBLIC,
      apiJWTIss: API_JWT_ISS,
      apiRateLimitTTL: parseInt(API_RATE_LIMIT_TTL, 10)
    };

    this.pgConfig = {
      host: PG_HOST,
      port: parseInt(PG_PORT, 10),
      user: PG_USER,
      password: PG_PASS,
      database: PG_DB,
      ssl: PG_SSL === "true"
    };
  }

  public getAppConfig(): AppConfig {
    // Return a copy
    return Object.assign({}, this.appConfig);
  }

  public getPGConfig(): PGConfig {
    // Return a copy
    return Object.assign({}, this.pgConfig);
  }
}
