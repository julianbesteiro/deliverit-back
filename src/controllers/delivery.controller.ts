import { BadUserInputError, UnauthorizedError } from '../errors/customErrors';
import {
  DataResponse,
  IDelivery,
  IDeliveryService,
  IDeliveryUpdateInput,
  IOrderInput,
  IOutputCreateDelivery,
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
import { isBlockedByAdmin } from '../utils/isBlockedByAdmin';
import { RequestExpress } from '../interfaces/IRequestExpress';
import { OrderService, UserService } from '../services';
import { IOrderForDeliverySchema } from '../interfaces/Entities/IOrder';

class DeliveryController {
  constructor(private readonly deliveryServices: IDeliveryService) {}

  createDelivery = asyncHandler(
    async (req: RequestExpress | Request, res: Response<DataResponse<IDelivery>>) => {
      const { body } = req;
      const { user } = req as RequestExpress;

      const orders: IOrderInput[] = body;

      await isBlockedByAdmin(user.id);

      const ordersCheck = await OrderService.checkIfOrdersAreValid(orders);

      const ordersValidate = await validateOrdersInput(ordersCheck);

      const { deliveries, totalPackages }: IOutputCreateDelivery =
        await this.deliveryServices.createDelivery({
          userId: user.id,
          orders: ordersValidate,
        });

      OrderService.updateOrderStatus(ordersValidate, 'signed');

      const { token } = await UserService.updateUser(user.id, {
        numberOfPacakagesPerDay: totalPackages,
      });

      res.setHeader('Authorization', `Bearer ${token}`);

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
      const { user } = req as RequestExpress;

      const filters = await validateDeliveryFilters({ ...query, userId: user.id });

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

      const inputCheck: IDeliveryUpdateInput =
        user.role === 'admin'
          ? inputValidated
          : await this.deliveryServices.canChangeStatus(user.id, deliveryId, inputValidated);

      const deliveryUpdated: IDelivery = await this.deliveryServices.updateDelivery(
        deliveryId,
        inputCheck,
      );

      if (inputCheck.status === 'cancelled') {
        const updateOrder = await OrderService.updateOrderStatus(
          [
            {
              orderId: (deliveryUpdated.orderId as IOrderForDeliverySchema)._id as string,
              packagesQuantity: (deliveryUpdated.orderId as IOrderForDeliverySchema)
                .packagesQuantity as number,
            },
          ],
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
    const { user } = req as RequestExpress;
    if (user.role !== 'admin') {
      throw new UnauthorizedError('Unauthorized');
    }

    if (!validateObjectId(id)) {
      throw new BadUserInputError({ id: 'Invalid id' });
    }

    await this.deliveryServices.deleteDelivery(id);

    return res.status(204).json({
      message: 'Delivery deleted',
      data: null,
      status: 204,
    });
  });
}

export { DeliveryController };
