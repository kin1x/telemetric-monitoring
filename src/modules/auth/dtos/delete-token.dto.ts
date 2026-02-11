import { Expose } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class DeleteTokenDto {
  @Expose()
  @IsString()
  @MinLength(16)
  @MaxLength(32)
  token: string;

  @Expose()
  @IsString()
  secret: string;
}
