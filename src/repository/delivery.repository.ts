import { IRepository } from '@/interfaces/IRepository';

import { BaseFilters, DeliveryRepositoryFilters, IDelivery, IDeliveryModel } from '../interfaces';
import { BadUserInputError, DatabaseConnectionError } from '@/errors/customErrors';

class DeliveryRepository implements IRepository<IDelivery> {
  constructor(private readonly deliveryModel: IDeliveryModel) {}

  async create(delivery: IDelivery): Promise<IDelivery> {
    const existingDelivery = await this.deliveryModel.findOne({
      orderId: delivery.orderId,
      status: {
        $in: ['delivered', 'pending', 'on-course'],
      },
    });

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
    filters?: DeliveryRepositoryFilters,
  ): Promise<{ data: IDelivery[]; page: number; totalPages: number; totalItems: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const filter: DeliveryRepositoryFilters = {};
    if (filters?.status) {
      filter.status = filters.status;
    }
    if (filters?.userId) {
      filter.userId = filters.userId;
    }

    const totalItems = await this.deliveryModel.countDocuments(filter);

    const totalPages = Math.ceil(totalItems / limit);

    const query = this.deliveryModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .select('status _id orderId userId');

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

  async update(delivery: IDelivery): Promise<IDelivery> {
    const { _id, ...updateData } = delivery; // Extraer _id y otros datos a actualizar
    console.log(_id);
    // Primero, busca el documento por su _id
    const existingDelivery = await this.deliveryModel.findById(_id);

    if (!existingDelivery) {
      throw new DatabaseConnectionError('Delivery not found'); // Manejar si el documento no se encuentra
    }

    // Actualiza los campos del documento con los datos proporcionados
    Object.assign(existingDelivery, updateData);

    // Guarda los cambios en la base de datos
    const deliveryUpdated = await existingDelivery.save();

    return deliveryUpdated;
  }

  async delete(id: string): Promise<void> {
    await this.deliveryModel.findByIdAndDelete(id);
  }
}

export default DeliveryRepository;
