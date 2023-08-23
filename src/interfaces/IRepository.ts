import { BaseFilters } from './IFilters';

export interface IRepository<T> {
  create: (item: T) => Promise<T | null>;
  findAll: (filters?: BaseFilters) => Promise<T[] | null>;
  findById: (id: string, filters?: BaseFilters) => Promise<T | null>;
  update: (id: string, item: T) => Promise<T | null>;
  delete: (id: string) => Promise<void>;
}
