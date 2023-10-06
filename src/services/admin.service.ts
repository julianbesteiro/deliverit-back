import AdminRepository from '../repository/admin.repository';
import mongoose from 'mongoose';

class AdminService {
  public static async workerDataByDate(day: number, month: number, year: number, nextDay: Date) {
    const availableWorkers = (await AdminRepository.availableWorkers(nextDay)).map((worker) => {
      return { id: worker._id, name: worker.name, urlImage: worker.urlImage };
    });

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

    const workerData = availableWorkers.map((worker) => {
      const objectIdToString = worker.id.toString();

      return {
        workerName: worker.name,
        workerId: worker.id,
        workerImage: worker.urlImage,
        status: valueCounts2[objectIdToString] ? 'active' : 'inactive',
        percentage: valueCounts[objectIdToString]
          ? Math.round((valueCounts2[objectIdToString] / valueCounts[objectIdToString]) * 100)
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
      .map((delivery) => {
        return { deliveryId: delivery._id, address: delivery.orderId?.address };
      });

    const pendingOrders = workerDataById.workerOrders
      .filter((delivery) => delivery.status !== 'delivered' && delivery.status !== 'cancelled')
      .map((delivery) => {
        return {
          deliveryId: delivery._id,
          address: delivery.orderId?.address,
          status: delivery.status,
        };
      });

    return {
      workerId: workerDataById.workerData.name,
      status: workerDataById.workerData.enabled ? 'active' : 'inactive',
      urlImage: workerDataById.workerData.urlImage,
      deliveredOrders: deliveredOrders,
      pendingOrders: pendingOrders,
    };
  }

  public static async orderDataByDate(day: number, month: number, year: number) {
    const orderDataByDate = await AdminRepository.availableOrdersByDate(day, month, year);

    const filteredOrderDataByDate = orderDataByDate.map((order) => {
      return {
        orderId: order._id,
        address: order.address,
      };
    });

    return filteredOrderDataByDate;
  }

  public static async dataByDate(day: number, month: number, year: number, nextDay: Date) {
    const deliveriesByDate = await AdminRepository.deliveriesByDate(day, month, year);

    const availableOrders = await AdminRepository.availableOrdersByDate(day, month, year);

    const availableWorkers = await AdminRepository.availableWorkers(nextDay);

    const activeWorkers = deliveriesByDate
      .filter((delivery) => delivery.status === 'delivered')
      .map((delivery) => delivery.userId?.toString());

    const uniqueActiveWorkers = [...new Set(activeWorkers)];

    const deliveredDeliveries = deliveriesByDate
      .filter((delivery) => delivery.status === 'delivered')
      .map((delivery) => delivery.orderId?.toString());

    //find uniqueActiveWorker on availableWorkers array and get urlImage property

    const activeWorkersImages = uniqueActiveWorkers.map((activeWorker) => {
      const findResult = availableWorkers.find((worker) => worker._id.toString() === activeWorker);
      return { id: findResult?._id.toString(), urlImage: findResult?.urlImage };
    });

    return {
      deliveredOrders: deliveredDeliveries.reduce((acc, delivery) => {
        availableOrders
          .map((order) => {
            if (delivery) return order._id.toString();
          })
          .includes(delivery)
          ? acc++
          : acc;
        return acc;
      }, 0),
      availableOrders: availableOrders.length,
      availableWorkers: availableWorkers.length,
      activeWorkers: { total: uniqueActiveWorkers.length, images: activeWorkersImages },
    };
  }

  public static async workerStatus(id: string) {
    const objectId = new mongoose.Types.ObjectId(id);

    const updateResult = await AdminRepository.workerStatus(objectId);

    return `Worker status updated to ${updateResult?.enabled ? 'active' : 'inactive'}`;
  }
}

export default AdminService;
