import { IsOptional, IsString, IsIn } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { SortOrders } from 'src/common/enums/sort-orders.enum';

export class FindManyLogsQueryDto extends PaginationQueryDto {
    @IsOptional()
    @IsString()
    search?: string;
  
    @IsOptional()
    @IsString()
    level?: string;
  
    @IsOptional()
    @IsString()
    @IsIn(['createdAt', 'order'])
    sortBy?: 'createdAt' | 'order';
  
    @IsOptional()
    @IsString()
    @IsIn(['ASC', 'DESC'])
    sorts?: { field: 'createdAt' | 'order' | 'type'; order: SortOrders }[];
    limit: number;
  }