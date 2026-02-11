import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LogEntity } from './log.entity';
import { ILogTrace } from '../modules/log/interfaces/log-trace.interface';
import { UuidV4Type } from '../common/types/uuid-v4.type';

@Entity('log_traces')
export class LogTraceEntity implements ILogTrace {
  @PrimaryGeneratedColumn('uuid')
  id: UuidV4Type;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text' })
  file: string;

  @Column({ type: 'int' })
  line: number;

  @Column({ type: 'int' })
  position: number;

  @ManyToOne(() => LogEntity, (log) => log.traces, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  log: LogEntity;

  constructor(partial: Partial<LogTraceEntity>) {
    Object.assign(this, partial);
  }
}