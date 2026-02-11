import { IsOptional, IsString } from 'class-validator';

export class LogFilterQueryDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  environment?: string;

  @IsOptional()
  @IsString()
  message?: string;
}