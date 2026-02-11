import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck')
  @HttpCode(200)
  public async getHealth(): Promise<string> {
    return this.appService.getHealth();
  }
}
