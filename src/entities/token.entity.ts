import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { LogEntity } from './log.entity';
@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'text', nullable: true })
  userId?: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.tokens)
  permissions: PermissionEntity[];

  @OneToMany(() => LogEntity, (log) => log.token)
  logs: LogEntity[];
}