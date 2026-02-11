import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IPaginationOptions } from 'src/common/interfaces/pagination-options.interface';

export interface IQueryPaginationDecoratorOptions {
  defaultPageSize?: number;
}

export const QueryPagination = createParamDecorator(
  (
    options: IQueryPaginationDecoratorOptions,
    ctx: ExecutionContext,
  ): IPaginationOptions => {
    const request = ctx.switchToHttp().getRequest();
    const { query } = request;
    const page = parseInt(query?.page) || 0;
    const pageSize =
      parseInt(query?.pageSize) || options?.defaultPageSize || 10;

    return {
      page,
      pageSize,
    };
  },
);
