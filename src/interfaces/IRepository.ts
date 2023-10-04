import { IDelivery } from './Entities/IDelivery';
import { BaseFilters } from './IFilters';

export interface IRepository<T> {
  create: (item: T) => Promise<T>;
  findAll: (filters?: BaseFilters) => Promise<PaginationData<T>>;
  findById: (id: string, filters?: BaseFilters) => Promise<T>;
  update: (id: string, item: T) => Promise<T>;
  delete: (id: string, userId: string) => Promise<void>;
  getLastSwornStatement?: (userId: string) => Promise<T | null>;
}

export interface IDeliveryRepository extends IRepository<IDelivery> {
  updateUserDeliveries: (userId: string, status: string) => Promise<IDelivery>;
}

export interface PaginationData<T> {
  data: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}
