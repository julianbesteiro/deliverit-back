import { BaseFilters } from './IFilters';

export interface OrderRepositoryFiltersWithDeliveryDate extends BaseFilters {
  status?: string;
  deliveryDate?: string;
}
