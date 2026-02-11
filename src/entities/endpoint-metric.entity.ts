import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('endpoint_metrics')
export class EndpointMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  method: string;

  @Column()
  path: string;

  @Column()
  statusCode: number;

  @Column('float')
  duration: number;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  ip?: string;
}