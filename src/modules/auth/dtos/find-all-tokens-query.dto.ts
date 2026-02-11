import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

export class FindAllTokensQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string; // Параметр для поиска по токену
  limit: number;
}