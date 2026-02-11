import { Injectable, LoggerService as ILogger } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Injectable()
export class MyLogger implements ILogger {
  constructor(private readonly logger: LoggerService) {
    this.logger.init('Nest');
  }

  public init(context: string): void {
    this.logger.init(context);
  }

  public debug(...args: any): void {
    this.logger.debug(...args);
  }

  public verbose(...args: any): void {
    this.logger.verbose(...args);
  }

  public log(...args: any): void {
    this.logger.log(...args);
  }

  public warn(...args: any): void {
    this.logger.warn(...args);
  }

  public error(...args: any): void {
    this.logger.error(...args);
  }

  public fatal(...args: any): void {
    this.logger.fatal(...args);
  }
}