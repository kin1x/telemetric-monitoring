import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  public async getHealth(): Promise<string> {
    const version: string = this.configService.get('version');
    return `OK ${version}`;
  }
}
