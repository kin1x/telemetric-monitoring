import { LogEntity } from 'src/entities/log.entity';
import { ILogTrace } from '../interfaces/log-trace.interface';
import { UuidV4Type } from 'src/common/types/uuid-v4.type';

export class LogTraceResponse implements ILogTrace {
  log: LogEntity;
  id: UuidV4Type;
  message: string;
  file: string;
  line: number;
  position: number;
}
