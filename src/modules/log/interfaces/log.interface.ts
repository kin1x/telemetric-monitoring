import { UuidV4Type } from 'src/common/types/uuid-v4.type';
import { TokenEntity } from 'src/entities/token.entity';
import { LogTraceEntity } from 'src/entities/log-trace.entity';

export interface ILog {
  id: UuidV4Type;
  type: string;
  message: string;
  factory: string;
  service: string;
  environment: string;
  createdAt: Date;
  token: TokenEntity | null;
  traces: LogTraceEntity[];
  order: number;
}
