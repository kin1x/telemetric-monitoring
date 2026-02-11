import { IsString, Length, IsInt, IsOptional, IsArray, ValidateNested, IsEnum, IsIn } from 'class-validator';
import { LogTraceDto } from './log-trace.dto';
import { Expose } from 'class-transformer';
import { LogTypes } from '../enums/log-types.enum';

export class CreateLogDto {
  @Expose()
  @IsEnum(LogTypes)
  type: LogTypes;

  @Expose()
  @IsString()
  @Length(1, 1000)
  message: string;

  @Expose()
  @IsString()
  @Length(1, 255)
  @IsIn(['info', 'error', 'warn', 'debug'])
  level: string;

  @Expose()
  @IsString()
  @Length(1, 255)
  factory: string;

  @Expose()
  @IsString()
  @Length(1, 255)
  service: string;

  @Expose()
  @IsString()
  @Length(1, 255)
  environment: string;

  @Expose()
  @IsInt()
  order: number;

  @Expose()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  traces?: LogTraceDto[];
}