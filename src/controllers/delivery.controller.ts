import { BadUserInputError } from '../errors/customErrors';
import {
  DataResponse,
  IDelivery,
  IDeliveryService,
  IDeliveryUpdateInput,
  IOrderInput,
  PaginationData,
  PaginationDataResponse,
} from '../interfaces'; // Ajusta la ruta según la estructura de carpetas
import { asyncHandler } from '../utils/asyncHandler'; // Ajusta la ruta según la estructura de carpetas
import { Request, Response } from 'express';
import { validateObjectId } from '../utils/validateObjectId';
import {
  validateDeliveryFilters,
  validateDeliveryUpdate,
  validateOrdersInput,
} from '../utils/validationDelivery';
import { RequestExpress } from '../interfaces/IRequestExpress';
import { OrderService } from '../services';

class DeliveryController {
  constructor(private readonly deliveryServices: IDeliveryService) {}

  createDelivery = asyncHandler(
    async (req: RequestExpress | Request, res: Response<DataResponse<IDelivery>>) => {
      const { body } = req;
      const { user } = req as RequestExpress;

      const orders: IOrderInput[] = body;

      const ordersValidate = await validateOrdersInput(orders);

      const deliveries: IDelivery | IDelivery[] = await this.deliveryServices.createDelivery({
        userId: user.id,
        orders: ordersValidate,
      });

      OrderService.updateOrderStatus(ordersValidate, 'signed');

      return res.status(201).json({
        message: 'Deliveries created',
        data: deliveries,
        status: 201,
      });
    },
  );

  getDelivery = asyncHandler(async (req: Request, res: Response<DataResponse<IDelivery>>) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      throw new BadUserInputError({ id: 'Invalid id' });
    }

    const delivery: IDelivery | null = await this.deliveryServices.getDelivery(id);

    return res.status(200).json({
      message: 'Delivery found',
      data: delivery,
      status: 200,
    });
  });

  getDeliveries = asyncHandler(
    async (
      req: Request,
      res: Response<PaginationDataResponse<IDelivery> | DataResponse<IDelivery>>,
    ) => {
      const { query } = req;

      const filters = await validateDeliveryFilters(query);

      let deliveries: PaginationData<IDelivery>;

      if (Object.keys(filters).length === 0) {
        deliveries = await this.deliveryServices.getDeliveries();
      } else {
        deliveries = await this.deliveryServices.getDeliveries(filters);
      }

      return res.status(200).json({
        message: 'Deliveries found',
        page: deliveries.page,
        totalPages: deliveries.totalPages,
        data: deliveries.data,
        totalItems: deliveries.totalItems,
        itemsPerPage: deliveries.data.length,
        prevPage: deliveries.page > 1 ? `/deliveries?page=${deliveries.page - 1}` : null,
        nextPage:
          deliveries.page < deliveries.totalPages
            ? `/deliveries?page=${deliveries.page + 1}`
            : null,
        status: 200,
      });
    },
  );

  updateDelivery = asyncHandler(
    async (req: RequestExpress | Request, res: Response<DataResponse<IDelivery>>) => {
      const { body } = req;
      const deliveryId = req.params.id;
      const { user } = req as RequestExpress;

      if (!validateObjectId(deliveryId)) {
        throw new BadUserInputError({ id: 'Invalid id' });
      }

      const inputValidated: IDeliveryUpdateInput = await validateDeliveryUpdate(body);

      const inputCheck: IDeliveryUpdateInput = await this.deliveryServices.canChangeStatus(
        user.id,
        deliveryId,
        inputValidated,
      );

      const deliveryUpdated: IDelivery = await this.deliveryServices.updateDelivery(
        deliveryId,
        inputCheck,
      );

      if (inputCheck.status === 'cancelled') {
        const updateOrder = await OrderService.updateOrderStatus(
          [{ orderId: deliveryUpdated.orderId as string }],
          'unassigned',
        );

        if (!updateOrder) {
          throw new BadUserInputError({ id: 'Invalid id' });
        }
      }

      return res.status(200).json({
        message: 'Delivery updated',
        data: deliveryUpdated,
        status: 200,
      });
    },
  );

  deleteDelivery = asyncHandler(async (req: Request, res: Response<DataResponse<IDelivery>>) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      throw new BadUserInputError({ id: 'Invalid id' });
    }

    await this.deliveryServices.deleteDelivery(id);

    return res.status(204);
  });
}

export { DeliveryController };
