import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LogTraceEntity } from './log-trace.entity';
import { TokenEntity } from './token.entity';
import { UuidV4Type } from '../common/types/uuid-v4.type';

@Index(['order', 'id'], { unique: false })
@Entity('logs')
export class LogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UuidV4Type;

  @Column({ type: 'text' })
  type: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text' })
  level: string;

  @Column({ type: 'text' })
  factory: string;

  @Column({ type: 'text' })
  service: string;

  @Column({ type: 'text' })
  environment: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => TokenEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tokenId' })
  token: TokenEntity;

  @OneToMany(() => LogTraceEntity, (trace) => trace.log, { cascade: true })
  traces: LogTraceEntity[];

  @Column({ type: 'int', default: 0 })
  order: number;

  constructor(partial: Partial<LogEntity>) {
    Object.assign(this, partial);
  }
}