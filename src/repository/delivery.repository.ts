import { IRepository } from '@/interfaces/IRepository';

import { BaseFilters, IDelivery, IDeliveryModel } from '../interfaces';
import { DatabaseConnectionError } from '@/errors/customErrors';

class DeliveryRepository implements IRepository<IDelivery> {
  constructor(private readonly deliveryModel: IDeliveryModel) {}

  async create(delivery: IDelivery): Promise<IDelivery | null> {
    const deliveryCreated = await this.deliveryModel.create(delivery);

    if (!deliveryCreated) {
      throw new DatabaseConnectionError('Delivery not created');
    }

    return deliveryCreated;
  }

  async findAll(filters?: BaseFilters): Promise<IDelivery[] | null> {
    if (filters) {
      return await this.deliveryModel.find(filters);
    }

    const deliveries = await this.deliveryModel.find();
    return deliveries;
  }

  async findById(id: string, filters?: BaseFilters): Promise<IDelivery | null> {
    if (filters) {
      return await this.deliveryModel.findOne({ _id: id, ...filters });
    }
    const delivery = await this.deliveryModel.findById(id);

    return delivery;
  }

  async update(id: string, delivery: IDelivery): Promise<IDelivery | null> {
    const deliveryUpdated = await this.deliveryModel.findByIdAndUpdate(
      id,
      { $set: delivery },
      { new: true }, // Devuelve el documento actualizado
    );

    return deliveryUpdated;
  }

  async delete(id: string): Promise<void> {
    await this.deliveryModel.findByIdAndDelete(id);
  }
}

export default DeliveryRepository;
