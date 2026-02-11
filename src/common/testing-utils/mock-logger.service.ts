/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoggerService as ILoggerService } from '@nestjs/common';

export class MockLoggerService implements ILoggerService {
  public async init(...args: any): Promise<void> {}

  public async debug(...args: any): Promise<void> {}

  public async verbose(...args: any): Promise<void> {}

  public async log(...args: any): Promise<void> {}

  public async warn(...args: any): Promise<void> {}

  public async error(...args: any): Promise<void> {}

  public async fatal(...args: any): Promise<void> {}
}
