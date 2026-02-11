import { Expose } from 'class-transformer';
import {
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateTokenDto {
  @Expose()
  @IsString({ message: 'token must be a string' })
  @MinLength(16, {
    message: 'token must be longer than or equal to 16 characters',
  })
  @MaxLength(32, {
    message: 'token must be shorter than or equal to 32 characters',
  })
  @IsNotEmpty({ message: 'token is required' })
  token: string;

  @Expose()
  @IsOptional()
  @IsInt({ message: 'expirationDate must be an integer number' })
  @Min(0, { message: 'expirationDate must not be less than 0' })
  @Max(Number.MAX_SAFE_INTEGER, {
    message: 'expirationDate must not be greater than 9007199254740991',
  })
  expirationDate?: number; 

  @Expose()
  @IsString({ message: 'secret must be a string' })
  @IsNotEmpty({ message: 'secret is required' })
  secret: string;
}