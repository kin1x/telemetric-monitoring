import { UuidV4Type } from 'src/common/types/uuid-v4.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IServiceToken } from 'src/modules/auth/interfaces/service-token.interface';

@Entity()
export class ServiceTokenEntity implements IServiceToken {
  @PrimaryGeneratedColumn('uuid')
  id: UuidV4Type;

  @Column({ type: 'text', unique: true })
  token: string;

  @Column({ type: 'timestamp', nullable: true})
  expirationDate: Date;

  constructor(partial: Partial<ServiceTokenEntity>) {
    Object.assign(this, partial);
  }
}
