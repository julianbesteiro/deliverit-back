import { asyncHandler } from '../../src/utils/asyncHandler';
import { Request, Response } from 'express';
import { OrderService } from '../services';
import { validateOrderInput } from '../utils/validateOrder';
import { validateObjectId } from '../utils/validateObjectId';
import { ValidationError } from '../errors/customErrors';
import { DataResponse, IOrder, PaginationData, PaginationDataResponse } from '../interfaces';

class OrderController {
  public static createOrder = asyncHandler(async (req: Request, res: Response) => {
    const { body } = req;

    const validatedData = await validateOrderInput(body);

    const order = await OrderService.createOrder(validatedData);
    return res.status(201).json({
      message: 'Order created',
      data: order,
      status: 201,
    });
  });

  //------------------------------------------------------------------------------------------------------------



  //------------------------------------------------------------------------------------------------------------


  public static getOrders = asyncHandler(
    async (req: Request, res: Response<PaginationDataResponse<IOrder> | DataResponse<IOrder>>) => {
      const filters = req.query;

      let orders: PaginationData<IOrder>;

      if (Object.keys(filters).length === 0) {
        orders = await OrderService.getOrders();
      } else {
        orders = await OrderService.getOrders(filters);
      }

      return res.status(200).send({
        message: 'orders found',
        page: orders.page,
        totalPages: orders.totalPages,
        data: orders.data,
        totalItems: orders.totalItems,
        itemsPerPage: orders.data.length,
        prevPage: orders.page > 1 ? `/orders?page=${orders.page - 1}` : null,
        nextPage: orders.page < orders.totalPages ? `/orders?page=${orders.page + 1}` : null,
        status: 200,
      });
    },
  );

  public static getOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const order = await OrderService.getOrder(orderId);
    return res.status(200).send(order);
  });

  public static deleteOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const objectIdValidation = validateObjectId(id);

    if (objectIdValidation === false) {
      throw new ValidationError('Invalid id');
    }

    const deletedOrder = await OrderService.deleteOrder(id);
    return res.status(201).json({
      message: 'Order request processed',
      data: deletedOrder ? 'Order deleted' : 'Order not found',
      status: 201,
    });
  });

  public static updateOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const updatedOrder = await OrderService.updateOrder(orderId, req.body);
    return res.status(200).send(updatedOrder);
  });

  public static patchOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const updatedFields = req.body;

    const patchedOrder = await OrderService.patchOrder(orderId, updatedFields);

    if (!patchedOrder) {
      return res.status(404).send({ message: 'Order not found' });
    }

    return res.status(200).send(patchedOrder);
  });
}

export { OrderController };
