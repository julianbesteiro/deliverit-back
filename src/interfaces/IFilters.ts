import { ValidStatus } from './Entities/IDelivery';

export interface BaseFilters {
  id?: string;
  limit?: number;
  sort?: string;
  page?: number;
}

export interface DeliveryRepositoryFilters extends BaseFilters {
  status?: ValidStatus;
  userId?: string;
}

export interface OrderRepositoryFilters extends BaseFilters {
  userId?: string;
  status?: string;
  deliveryDate?: string | Date;
}
