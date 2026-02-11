import { SortOrders } from '../enums/sort-orders.enum';
import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export interface ISortOptions<T> {
  sortBy: T | null;
  sortOrder: SortOrders | null;
}

export interface IQuerySortingDecoratorOptions<T> {
  defaultSortBy?: T | null;
  defaultSortOrder?: SortOrders | null;
  sortOptions: T[];
}

export const QuerySorting = createParamDecorator(
  <T extends string>(
    options: IQuerySortingDecoratorOptions<T>,
    ctx: ExecutionContext,
  ): ISortOptions<T> => {
    const request = ctx.switchToHttp().getRequest();
    const { query } = request;

    const sortBy: T | null = query?.sortBy || options?.defaultSortBy || null;
    const sortOrder: SortOrders | null =
      query?.sortOrder || options?.defaultSortOrder || null;

    // Валидация sortBy (если передан, должен быть одним из допустимых значений)
    if (sortBy !== null && !options.sortOptions.includes(sortBy as T)) {
      throw new BadRequestException(
        `Invalid sortBy value. Allowed values: ${options.sortOptions.join(', ')}`,
      );
    }

    // Валидация sortOrder (если передан, должен быть одним из значений SortOrders)
    if (sortOrder !== null && !Object.values(SortOrders).includes(sortOrder)) {
      throw new BadRequestException(
        `Invalid sortOrder value. Allowed values: ${Object.values(SortOrders).join(', ')}`,
      );
    }

    return {
      sortBy: (sortBy as T) || null,
      sortOrder: sortOrder as SortOrders | null,
    };
  },
);
