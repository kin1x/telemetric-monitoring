import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { TokenEntity } from './token.entity';

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToMany(() => TokenEntity, (token) => token.permissions, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'permission_token',
    joinColumn: { name: 'permissionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tokenId', referencedColumnName: 'id' },
  })
  tokens: TokenEntity[];
}