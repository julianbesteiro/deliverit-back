import { BaseFilters, IDelivery, IDeliveryDocument } from '@/interfaces';
import { IDeliveryModel } from '@/interfaces';
import { IRepository } from '@/interfaces/IRepository';
import { UpdateResult } from 'mongodb';
import { Connection } from 'mongoose';

class DeliveryRepository implements IRepository<IDelivery> {
  constructor(
    private readonly deliveryModel: IDeliveryModel,
    private readonly db: Connection,
  ) {}

  async create(delivery: IDelivery): Promise<IDelivery | null> {
    const deliveryCreated = await this.deliveryModel.create(delivery);
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
      return await this.deliveryModel.findOne({ where: { id }, ...filters });
    }
    const delivery = await this.deliveryModel.findById(id);
    return delivery;
  }

  async update(id: string, delivery: IDelivery): Promise<IDelivery | null> {
    // Usa el tipo UpdateResult correcto aquí
    const deliveryUpdated: UpdateResult<IDeliveryDocument> = await this.deliveryModel.updateOne(
      { where: { id } },
      { delivery },
    );

    if (deliveryUpdated.modifiedCount === 1) {
      // Obtiene y devuelve el documento actualizado
      const updatedDelivery = await this.deliveryModel.findById(id);
      return updatedDelivery;
    } else {
      return null; // Maneja el fallo de la actualización si es necesario
    }
  }

  async delete(id: string): Promise<void> {
    await this.deliveryModel.deleteOne({ where: { id } });
  }
}

export default DeliveryRepository;
