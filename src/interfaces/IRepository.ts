import { BaseFilters } from './IFilters';

export interface IRepository<T> {
  create: (item: T) => Promise<T>;
  findAll: (filters?: BaseFilters) => Promise<T[]>;
  findById: (id: string, filters?: BaseFilters) => Promise<T>;
  update: (id: string, item: T) => Promise<T>;
  delete: (id: string) => Promise<void>;
}
