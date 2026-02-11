import { Expose } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number = 0;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  pageSize?: number = 100;
}
