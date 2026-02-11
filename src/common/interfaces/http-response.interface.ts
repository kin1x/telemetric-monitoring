export interface IHttpPaginationResponse {
  page?: number;
  totalPages?: number;
  pageSize?: number;
  totalCount?: number;
}

export interface IHttpResponse<T> extends IHttpPaginationResponse {
  message: string;
  item?: T;
  items?: T[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}
