import pino from "pino";
import { inject, singleton } from "tsyringe";
import { AppConfiguration } from "./config";

@singleton()
export class Logger {
  logger: pino.Logger;

  constructor(@inject(AppConfiguration) appConfiguration: AppConfiguration) {
    this.logger = pino({
      level: appConfiguration.getAppConfig().logLevel.toLowerCase()
    });
  }
}
