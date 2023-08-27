export interface BaseFilters {
  // Define propiedades comunes para todos los filtros si es necesario
}

export interface UserRepositoryFilters extends BaseFilters {
  status?: string;
}
