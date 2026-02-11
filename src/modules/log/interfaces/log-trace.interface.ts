import { UuidV4Type } from "src/common/types/uuid-v4.type";
import { LogEntity } from "src/entities/log.entity";

export interface ILogTrace {
  id: UuidV4Type;
  message: string;
  file: string;
  line: number;
  position: number;
  log: LogEntity;
  }
  