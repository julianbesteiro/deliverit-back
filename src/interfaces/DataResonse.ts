export interface DataResponse<T> {
  message: string;
  data: T | T[] | null;
  status: number;
}

export interface PaginationDataResponse<T> extends DataResponse<T> {
  page: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  prevPage: string | null;
  nextPage: string | null;
}
