import { SortOrders } from '../enums/sort-orders.enum';

export interface ISortOptions<T extends string> {
  sortBy: string;
  sorts: { sortBy: T; sortOrder: SortOrders }[];
}