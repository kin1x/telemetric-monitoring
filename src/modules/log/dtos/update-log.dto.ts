import {
  IsString,
  Length,
  IsInt,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { LogTraceDto } from './log-trace.dto';
import { LogTypes } from '../enums/log-types.enum';
import { Expose } from 'class-transformer';

export class UpdateLogDto {
  @Expose()
  @IsOptional()
  @IsEnum(LogTypes)
  type?: LogTypes;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  message?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(1, 255)
  factory?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(1, 255)
  service?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(1, 255)
  environment?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  sessionToken?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  order?: number;

  @Expose()
  @IsOptional()
  @IsArray()
  traces?: LogTraceDto[];
}
