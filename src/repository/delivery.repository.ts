import { IRepository } from '@/interfaces/IRepository';

import { BaseFilters, IDelivery, IDeliveryModel } from '../interfaces';
import { DatabaseConnectionError } from '@/errors/customErrors';

class DeliveryRepository implements IRepository<IDelivery> {
  constructor(private readonly deliveryModel: IDeliveryModel) {}

  async create(delivery: IDelivery): Promise<IDelivery> {
    const deliveryCreated = await this.deliveryModel.create(delivery);

    if (!deliveryCreated) {
      throw new DatabaseConnectionError('Delivery not created');
    }

    return deliveryCreated;
  }

  async findAll(filters?: BaseFilters): Promise<IDelivery[]> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10; // Establece un valor predeterminado

    const skip = (page - 1) * limit;

    if (filters) {
      const query = this.deliveryModel.find(filters);
      query.skip(skip).limit(limit);
      return await query.exec();
    }

    const deliveries = await this.deliveryModel.find().skip(skip).limit(limit).exec();
    return deliveries;
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
