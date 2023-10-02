import { BaseFilters } from './IFilters';

export interface OrderRepositoryFiltersWithDeliveryDate extends BaseFilters {
  userId?: string;
  status?: string;
  deliveryDate?: string;
}