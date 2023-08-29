export interface BaseFilters {
  id?: string;
  limit?: number;
  skip?: number;
  sort?: string;
  page?: number;
}

export interface DeliveryRepositoryFilters extends BaseFilters {
  status?: string;
}
