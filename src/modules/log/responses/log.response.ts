import { UuidV4Type } from 'src/common/types/uuid-v4.type';
import { LogTraceResponse } from './log-trace.response';
import { TokenEntity } from 'src/entities/token.entity';

export class LogResponse {
  id: UuidV4Type;
  type: string;
  message: string;
  level: string;
  factory: string;
  service: string;
  environment: string;
  order: number;
  createdAt: Date;
  token?: TokenEntity;
  traces: LogTraceResponse[];
}