import { Expose } from 'class-transformer';
import { IsString, Length, IsInt } from 'class-validator';

export class LogTraceDto {
  @Expose()
  @IsString()
  @Length(1, 1000)
  message: string;

  @Expose()
  @IsString()
  @Length(1, 255)
  file: string;

  @Expose()
  @IsInt()
  line: number;

  @Expose()
  @IsInt()
  position: number;
}
