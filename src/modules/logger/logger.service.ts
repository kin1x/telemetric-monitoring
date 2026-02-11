import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { ErrorLevels } from './error-levels.enum';
import { LogService } from '../log/services/log.service';
import * as util from 'util';
import { LogTypes } from '../log/enums/log-types.enum';

enum Color {
  Black = '\x1b[30m',
  Red = '\x1b[31m',
  Green = '\x1b[32m',
  Yellow = '\x1b[33m',
  Blue = '\x1b[34m',
  Magenta = '\x1b[35m',
  Cyan = '\x1b[36m',
  White = '\x1b[37m',
  Reset = '\x1b[0m',
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context: string = 'unknown';
  private microservice: string = 'BOILERPLATE';
  private deployment: string = 'production';
  private environment: string = 'development';
  private classesWhitelist: string[];
  private classesBlacklist: string[];
  private levelsBlacklist: ErrorLevels[];
  private levelsWhitelist: ErrorLevels[];
  private readonly logger: winston.Logger;
  logService: any;

  constructor(
    private readonly configService: ConfigService,

  ) {
    this.microservice = this.configService.get('logger.microservice') || 'BOILERPLATE';
    this.deployment = this.configService.get('logger.deployment') || 'production';
    this.environment = this.configService.get('logger.environment') || 'development';
    this.classesBlacklist = this.configService.get('logger.filterClasses.blacklist') || [];
    this.classesWhitelist = this.configService.get('logger.filterClasses.whitelist') || [];
    this.levelsBlacklist = this.configService
      .get('logger.filterLevels.blacklist', [])
      .map((level) => this.convertLevel(level));
    this.levelsWhitelist = this.configService
      .get('logger.filterLevels.whitelist', [])
      .map((level) => this.convertLevel(level));

    this.logger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  private convertLevel(levelString: string): ErrorLevels {
    switch (String(levelString).toLowerCase()) {
      case 'debug': return ErrorLevels.DEBUG;
      case 'log': return ErrorLevels.LOG;
      case 'verbose': return ErrorLevels.VERBOSE;
      case 'warn': return ErrorLevels.WARN;
      case 'error': return ErrorLevels.ERROR;
      case 'fatal': return ErrorLevels.FATAL;
      default: return ErrorLevels.LOG;
    }
  }

  private isLevelWhitelisted(level: ErrorLevels): boolean {
    return this.levelsWhitelist.length > 0 && !this.levelsWhitelist.includes(level);
  }

  private isLevelBlacklisted(level: ErrorLevels): boolean {
    return this.levelsBlacklist.length > 0 && this.levelsBlacklist.includes(level);
  }

  private isServiceWhitelisted(): boolean {
    return this.classesWhitelist.length > 0 && !this.classesWhitelist.includes(this.context);
  }

  private isServiceBlacklisted(): boolean {
    return this.classesBlacklist.length > 0 && this.classesBlacklist.includes(this.context);
  }

  private isFiltered(level: ErrorLevels): boolean {
    return (
      this.isLevelBlacklisted(level) ||
      this.isLevelWhitelisted(level) ||
      this.isServiceBlacklisted() ||
      this.isServiceWhitelisted()
    );
  }

  private format(payload: any): { message: string; hasError: boolean } {
    if (!Array.isArray(payload)) payload = [payload];
    const messages: string[] = [];
    let hasError = false;
    payload.forEach((item) => {
      messages.push(util.inspect(item));
      if (item instanceof Error) hasError = true;
    });
    return { message: messages.join(', '), hasError };
  }

  private getDate(): string {
    return new Date().toISOString();
  }

  private suffix(message: string, level: ErrorLevels): string {
    return `${this.getDate()} - [${String(level).toUpperCase()}] [${this.deployment}] [${this.microservice}:${this.environment}] [${this.context}] ${message}`;
  }

  private getStack(): string {
    const stack = new Error().stack;
    return stack || 'No stack trace available';
  }

  private paintText(text: string, level: ErrorLevels): string {
    switch (level) {
      case ErrorLevels.DEBUG: return `${Color.Magenta}${text}${Color.Reset}`;
      case ErrorLevels.VERBOSE: return `${Color.Cyan}${text}${Color.Reset}`;
      case ErrorLevels.LOG: return `${Color.Green}${text}${Color.Reset}`;
      case ErrorLevels.WARN: return `${Color.Yellow}${text}${Color.Reset}`;
      case ErrorLevels.ERROR: return `${Color.Red}${text}${Color.Reset}`;
      case ErrorLevels.FATAL: return `${Color.Red}${text}${Color.Reset}`;
    }
  }

  private async logMessage(level: ErrorLevels, payload: any): Promise<void> {
    if (this.isFiltered(level)) return;

    const { message, hasError } = this.format(payload);
    const suffix = this.suffix(message, level);
    const painted = this.paintText(suffix, level);

    const logEntry = {
      timestamp: this.getDate(),
      level: String(level).toUpperCase(),
      deployment: this.deployment,
      microservice: this.microservice,
      environment: this.environment,
      context: this.context,
      message,
    };

    this.logger.log(level.toLowerCase(), logEntry);

    switch (level) {
      case ErrorLevels.DEBUG:
      case ErrorLevels.LOG:
      case ErrorLevels.VERBOSE:
        console.log(painted);
        break;
      case ErrorLevels.WARN:
        console.warn(painted);
        break;
      case ErrorLevels.ERROR:
      case ErrorLevels.FATAL:
        console.error(painted);
        await this.logService.createOne({
          type: LogTypes.Error,
          message: '...',
          factory: '...',
          service: '...',
          environment: '...',
          order: 0,
          level: 'error',
        });
        break;
    }

    if (!hasError && [ErrorLevels.ERROR, ErrorLevels.FATAL].includes(level)) {
      const stack = this.getStack();
      const stackSuffix = this.suffix(stack, level);
      const stackPainted = this.paintText(stackSuffix, level);
      this.logger.error({ ...logEntry, message: stack });
      console.error(stackPainted);
    }
  }

  public async debug(...message: any): Promise<void> {
    await this.logMessage(ErrorLevels.DEBUG, message);
  }

  public async verbose(...message: any): Promise<void> {
    await this.logMessage(ErrorLevels.VERBOSE, message);
  }

  public async log(...message: any): Promise<void> {
    await this.logMessage(ErrorLevels.LOG, message);
  }

  public async warn(...message: any): Promise<void> {
    await this.logMessage(ErrorLevels.WARN, message);
  }

  public async error(...message: any): Promise<void> {
    await this.logMessage(ErrorLevels.ERROR, message);
  }

  public async fatal(...message: any): Promise<void> {
    await this.logMessage(ErrorLevels.FATAL, message);
  }

  public init(context: string): void {
    this.context = context;
  }
}