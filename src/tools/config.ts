import dotenv from "dotenv";
import { defaults } from "lodash";
import { singleton } from "tsyringe";

interface AppConfig {
  nodeEnv: string;
  logLevel: string;
  apiPort: number;
  apiJWTPublic: string;
  apiJWTIss: string;
  apiRateLimitTTL: number;
}

@singleton()
export class AppConfiguration {
  private appConfig?: AppConfig;

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
      API_RATE_LIMIT_TTL: "3600"
    };

    defaults(process.env, baseConfig);

    const { NODE_ENV, LOG_LEVEL, API_PORT, API_JWT_PUBLIC, API_JWT_ISS, API_RATE_LIMIT_TTL } = process.env;

    this.appConfig = {
      nodeEnv: NODE_ENV,
      logLevel: LOG_LEVEL,
      apiPort: parseInt(API_PORT, 10),
      apiJWTPublic: API_JWT_PUBLIC ? Buffer.from(API_JWT_PUBLIC, "base64").toString("utf-8") : API_JWT_PUBLIC,
      apiJWTIss: API_JWT_ISS,
      apiRateLimitTTL: parseInt(API_RATE_LIMIT_TTL, 10)
    };
  }

  public getAppConfig(): AppConfig {
    // Return a copy
    return Object.assign({}, this.appConfig);
  }
}
