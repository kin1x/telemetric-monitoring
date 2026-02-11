import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('db_metrics')
export class DbMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  query: string;

  @Column({ type: 'float' })
  duration: number;

  @Column({ type: 'text' })
  entity: string;

  @Column({ type: 'text' })
  operation: string;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ type: 'text', nullable: true })
  userId?: string;

  @Column({ type: 'text', nullable: true })
  endpoint?: string;
}