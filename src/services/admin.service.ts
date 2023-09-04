import { IOrder } from '@/interfaces';
import AdminRepository from '@/repository/admin.repository';
import { IOrderInput } from '@/utils/validateOrder';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

class AdminService {
  public static async workerDataByDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Adding 1 because getMonth() returns 0-based month (0 = January, 1 = February, and so on)
    const year = date.getFullYear();

    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);

    const availableWorkers = (await AdminRepository.availableWorkers(newDate)).map(
      (worker) => worker._id,
    );

    const deliveriesByDate = await AdminRepository.deliveriesByDate(day, month, year);

    const valueCounts: { [key: string]: number } = {};

    const valueCounts2: { [key: string]: number } = {};

    deliveriesByDate.forEach((value) => {
      if (valueCounts[value.userId as string]) {
        valueCounts[value.userId as string]++;
      } else {
        valueCounts[value.userId as string] = 1;
      }
    });

    deliveriesByDate.forEach((value) => {
      if (value.status == 'delivered' && valueCounts2[value.userId as string]) {
        valueCounts2[value.userId as string]++;
      } else if (value.status == 'delivered') {
        valueCounts2[value.userId as string] = 1;
      }
    });

    const workerData = availableWorkers.map((worker: ObjectId) => {
      const objectIdToString = worker.toString();

      return {
        workerId: worker,
        status: valueCounts2[objectIdToString] ? 'active' : 'inactive',
        percentage: valueCounts[objectIdToString]
          ? (valueCounts2[objectIdToString] / valueCounts[objectIdToString]) * 100
          : 0,
      };
    });

    return workerData;
  }

  public static async workerDataById(id: string) {
    const objectId = new mongoose.Types.ObjectId(id);

    const workerDataById = await AdminRepository.deliveryDataById(objectId);

    const deliveredOrders = workerDataById.workerOrders
      .filter((delivery) => delivery.status === 'delivered')
      .map((order) => {
        return { orderId: order._id, address: order.destinationLocation };
      });

    const pendingOrders = workerDataById.workerOrders
      .filter((delivery) => delivery.status !== 'delivered')
      .map((order) => {
        return { orderId: order._id, address: order.destinationLocation };
      });

    return {
      workerId: workerDataById.workerData._id,
      status: workerDataById.workerData.enabled ? 'active' : 'inactive',
      deliveredOrders: deliveredOrders,
      pendingOrders: pendingOrders,
    };
  }

  public static async orderDataByDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Adding 1 because getMonth() returns 0-based month (0 = January, 1 = February, and so on)
    const year = date.getFullYear();

    const orderDataByDate = await AdminRepository.availableOrdersByDate(day, month, year);

    const filteredOrderDataByDate = orderDataByDate.map((order) => {
      return {
        id: order._id,
        address: order.address,
      };
    });

    return filteredOrderDataByDate;
  }

  public static async dataByDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Adding 1 because getMonth() returns 0-based month (0 = January, 1 = February, and so on)
    const year = date.getFullYear();

    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);

    const deliveriesByDate = await AdminRepository.deliveriesByDate(day, month, year);

    const availableOrders = await AdminRepository.availableOrdersByDate(day, month, year);

    const availableWorkers = await AdminRepository.availableWorkers(newDate);

    const activeWorkers = deliveriesByDate.map((delivery) => delivery.userId?.toString());

    const deliveredDeliveries = deliveriesByDate.filter(
      (delivery) => delivery.status === 'delivered',
    );

    const uniqueActiveWorkers = [...new Set(activeWorkers)];

    return {
      deliveredOrders: availableOrders.reduce((acc, order) => {
        deliveredDeliveries
          .map((delivery) => delivery.orderId.toString())
          .includes(order._id.toString())
          ? acc++
          : acc;
        return acc;
      }, 0),
      availableOrders: availableOrders.length,
      availableWorkers: availableWorkers.length,
      activeWorkers: uniqueActiveWorkers.length,
    };
  }

  public static async newOrder(order: IOrderInput) {
    const date = new Date(order.deliveryDate);

    const newOrderInput: IOrder = { ...order, deliveryDate: date };

    const newOrder = await AdminRepository.newOrder(newOrderInput as IOrder);

    const returnedOrder = {
      address: newOrder.address,
      coords: newOrder.coords,
      packagesQuantity: newOrder.packagesQuantity,
      weight: newOrder.weight,
      recipient: newOrder.recipient,
      status: newOrder.status,
      deliveryDate: newOrder.deliveryDate,
    };
    return returnedOrder;
  }

  public static async orderToRemove(id: string) {
    const objectId = new mongoose.Types.ObjectId(id);

    const deletionStatus = await AdminRepository.orderToRemove(objectId);

    return deletionStatus ? 'Order deleted' : 'Order not found';
  }

  public static async workerStatus(id: string) {
    const objectId = new mongoose.Types.ObjectId(id);

    const updateResult = await AdminRepository.workerStatus(objectId);

    return `Worker status updated to ${updateResult?.enabled ? 'active' : 'inactive'}`;
  }
}

export default AdminService;
