import { IRepository } from '@/interfaces/IRepository';

import { BaseFilters, IDelivery, IDeliveryModel } from '../interfaces';
import { BadUserInputError, DatabaseConnectionError } from '@/errors/customErrors';

class DeliveryRepository implements IRepository<IDelivery> {
  constructor(private readonly deliveryModel: IDeliveryModel) {}

  async create(delivery: IDelivery): Promise<IDelivery> {
    const existingDelivery = await this.deliveryModel.findOne({ orderId: delivery.orderId });

    if (existingDelivery) {
      throw new BadUserInputError({ message: 'Delivery already exists' });
    }

    const deliveryCreated = await this.deliveryModel.create(delivery);

    if (!deliveryCreated) {
      throw new DatabaseConnectionError('Delivery not created');
    }

    return deliveryCreated;
  }

  async findAll(
    filters?: BaseFilters,
  ): Promise<{ data: IDelivery[]; page: number; totalPages: number; totalItems: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10; // Establece un valor predeterminado

    const skip = (page - 1) * limit;

    let query = this.deliveryModel.find();

    // Si se proporcionan filtros, aplícalos a la consulta
    if (filters) {
      query = query.find(filters);
    }

    // Obtén el número total de elementos sin paginación
    const totalItems = await this.deliveryModel.countDocuments();

    // Calcula el número total de páginas
    const totalPages = Math.ceil(totalItems / limit);

    // Aplica la paginación a la consulta
    query = query.skip(skip).limit(limit);

    // Ejecuta la consulta
    const deliveries = await query.exec();

    return {
      data: deliveries,
      page,
      totalPages,
      totalItems,
    };
  }
  async findById(id: string, filters?: BaseFilters): Promise<IDelivery> {
    if (filters) {
      const delivery = await this.deliveryModel.findOne({ _id: id, ...filters });
      if (!delivery) {
        throw new DatabaseConnectionError('Delivery not found');
      }
      return delivery;
    }
    const delivery = await this.deliveryModel.findById(id);

    if (!delivery) {
      throw new DatabaseConnectionError('Delivery not found');
    }

    return delivery;
  }

  async update(id: string, delivery: IDelivery): Promise<IDelivery> {
    const deliveryUpdated = await this.deliveryModel.findByIdAndUpdate(
      id,
      { $set: delivery },
      { new: true }, // Devuelve el documento actualizado
    );

    if (!deliveryUpdated) {
      throw new DatabaseConnectionError('Delivery not updated');
    }

    return deliveryUpdated;
  }

  async delete(id: string): Promise<void> {
    await this.deliveryModel.findByIdAndDelete(id);
  }
}

export default DeliveryRepository;
