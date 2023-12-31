import Order from '../models/Order';
import { IOrder, IOrderInput, OrderRepositoryFilters } from '../../src/interfaces/';
import { EntityNotFoundError } from '../errors/customErrors';

import { OrderRepositoryFiltersWithDeliveryDate } from '../../src/interfaces/IFiltersWithDeliveryDate';

class OrderRepository {
  static async createOrder(order: IOrder) {
    const newOrder = await Order.create(order);
    return newOrder;
  }

  static async findAll(
    filters?: OrderRepositoryFiltersWithDeliveryDate,
  ): Promise<{ data: IOrder[]; page: number; totalPages: number; totalItems: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const filter: OrderRepositoryFilters = {};

    if (filters?.deliveryDate) {
      filter.deliveryDate = filters.deliveryDate;
    }
    if (filters?.status) {
      filter.status = filters.status;
    }

    const totalItems = await Order.countDocuments(filter);

    const totalPages = Math.ceil(totalItems / limit);

    const query = Order.find(filter).skip(skip).limit(limit);

    const orders = await query.exec();

    return {
      data: orders,
      page,
      totalPages,
      totalItems,
    };
  }

  static async getOrder(orderId: string) {
    const order = await Order.findById(orderId);
    if (!order) {
      const entityName = 'Order';
      throw new EntityNotFoundError(entityName);
    }
    return order;
  }

  static async deleteOrder(orderId: string) {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      const entityName = 'Order';
      throw new EntityNotFoundError(entityName);
    }
    return deletedOrder;
  }

  static async updateOrder(orderId: string, updatedOrder: IOrder) {
    const options = { new: true };
    const updated = await Order.findByIdAndUpdate(orderId, updatedOrder, options);
    if (!updated) {
      const entityName = 'Order';
      throw new EntityNotFoundError(entityName);
    }
    return updated;
  }

  static async patchOrder(orderId: string, updatedFields: Partial<IOrder>) {
    const options = { new: true };
    const patched = await Order.findByIdAndUpdate(orderId, updatedFields, options);
    return patched;
  }

  static async updateOrderStatus(orders: IOrderInput[], status: string) {
    const ordersId = orders.map((order) => order.orderId);

    const updateResult = await Order.updateMany(
      { _id: { $in: ordersId } },
      { $set: { status: status } },
    );

    if (updateResult.modifiedCount === orders.length) {
      const updatedOrders = await Order.find({ _id: { $in: ordersId } });
      return updatedOrders;
    } else {
      throw new EntityNotFoundError('No se pudieron actualizar las órdenes.');
    }
  }
}

export { OrderRepository };
