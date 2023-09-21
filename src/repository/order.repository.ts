import Order from '../models/Order';
import { IOrder, OrderRepositoryFilters } from '../../src/interfaces/';
import { EntityNotFoundError } from '../errors/customErrors';

class OrderRepository {
  static async createOrder(order: IOrder) {
    const newOrder = await Order.create(order);
    return newOrder;
  }

  static async getOrders(
    filters?: OrderRepositoryFilters,
  ): Promise<Promise<{ data: IOrder[]; page: number; totalPages: number; totalItems: number }>> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const filter: OrderRepositoryFilters = {};

    if (filters?.userId) {
      filter.userId = filters.userId;
    }
    if (filters?.status) {
      filter.status = filters.status;
    }

    const totalItems = await Order.countDocuments(filter);

    const totalPages = Math.ceil(totalItems / limit);

    const query = Order.find(filter)
      .skip(skip)
      .limit(limit)
      .select('_id status userId address packagesQuantity weight');

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
    const options = { new: true }; // Devolver el documento actualizado
    const updated = await Order.findByIdAndUpdate(orderId, updatedOrder, options);
    if (!updated) {
      const entityName = 'Order';
      throw new EntityNotFoundError(entityName);
    }
    return updated;
  }

  static async patchOrder(orderId: string, updatedFields: Partial<IOrder>) {
    const options = { new: true }; // Devolver el documento actualizado
    const patched = await Order.findByIdAndUpdate(orderId, updatedFields, options);
    return patched;
  }
}

export { OrderRepository };
