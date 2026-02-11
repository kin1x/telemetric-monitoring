import { UuidV4Type } from 'src/common/types/uuid-v4.type';
import { IServiceToken } from '../interfaces/service-token.interface';

export class ServiceTokenResponse implements IServiceToken {
  id: UuidV4Type;
  token: string;
  expirationDate: number;
}
