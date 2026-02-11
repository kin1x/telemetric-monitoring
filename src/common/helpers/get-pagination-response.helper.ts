import { IHttpPaginationResponse } from '../interfaces/http-response.interface';
import { IPaginationOptions } from '../interfaces/pagination-options.interface';

export function getPaginationResponse(
  requestPagination: IPaginationOptions,
  totalItems: number,
): IHttpPaginationResponse {
  return {
    page: requestPagination.page,
    totalPages: Math.ceil(totalItems / requestPagination.pageSize),
    pageSize: requestPagination.pageSize,
    totalCount: totalItems,
  };
}
