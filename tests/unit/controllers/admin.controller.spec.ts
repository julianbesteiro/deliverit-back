import { AdminController } from '../../../src/controllers/admin.controller';
import express from 'express';
import { ObjectId } from 'mongodb';
import AdminService from '../../../src/services/admin.service';
import { IDeliveryForTesting } from '../../../src/interfaces';
import { IWorker } from '../../../src/interfaces';
import { mock } from 'node:test';
import { db } from '../../../config/db';
import * as validateOrder from '../../../src/utils/validateOrder';
import { OrderService } from '../../../src/services';
import { validateDate } from '../../../src/utils/validateDate';
import { m } from 'framer-motion';

describe('AdminController', () => {
  let mockRequest: Partial<express.Request>;
  let mockResponse: Partial<express.Response>;
  let mockNext: express.NextFunction;

  describe('createOrder', () => {
    beforeEach(() => {
      jest.mock('../../../src/services/admin.service');
      jest.mock('../../../src/services/order.service');

      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create an order', async () => {
      const orderInput = {
        address: 'casa 1312, CABA',
        coords: { lat: -34.603722, lng: -58.381592 },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Juan Perez',
        deliveryDate: '2023-09-01',
      };

      const orderOutput = {
        address: 'casa 13, CABA',
        coords: {
          lat: -34.603722,
          lng: -58.381592,
        },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Juan Perez',
        status: 'unassigned',
        deliveryDate: '2023-09-01',
      };

      mockRequest.body = orderInput;

      const newOrderServiceMock = jest.spyOn(OrderService, 'createOrder');
      newOrderServiceMock.mockResolvedValue(orderOutput as any);

      await expect(
        AdminController.newOrder(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(newOrderServiceMock).toHaveBeenCalledWith(orderInput);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Order created',
        data: orderOutput,
        status: 201,
      });
      expect.assertions(4);
    });

    it('should throw an error if the request body is invalid', async () => {
      const orderInput = {
        address: 231,
        coords: 123123,
        packagesQuantity: 'test',
        weight: 'test',
        recipient: 1231,
        date: 656,
      };

      mockRequest.body = orderInput;

      const newOrderServiceMock = jest.spyOn(OrderService, 'createOrder');

      await expect(
        AdminController.newOrder(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(newOrderServiceMock).not.toHaveBeenCalled();

      expect(mockResponse.status).not.toHaveBeenCalledWith();

      expect(mockResponse.json).not.toHaveBeenCalledWith();

      expect.assertions(4);
    });
  });

  describe('getDataByDate', () => {
    beforeEach(() => {
      jest.mock('../../../src/services/admin.service');

      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should get analytics based on a specific date', async () => {
      mockRequest.params = { date: '2023-09-01' };

      const { day, month, year, nextDay } = await validateDate(mockRequest.params.date);

      const dataByDateOutput = {
        availableWorkers: 2,
        activeWorkers: { total: 0, images: [{ id: '', urlImage: '' }] },
        availableOrders: 0,
        deliveredOrders: 0,
      };

      const dataByDateServiceMock = jest.spyOn(AdminService, 'dataByDate');
      dataByDateServiceMock.mockResolvedValue(dataByDateOutput);

      await expect(
        AdminController.dataByDate(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(dataByDateServiceMock).toHaveBeenCalledWith(day, month, year, nextDay);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should throw an error if the date is invalid', async () => {
      mockRequest.params = { date: '!!' as any };

      const dataByDateServiceMock = jest.spyOn(AdminService, 'dataByDate');

      await expect(
        AdminController.dataByDate(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(dataByDateServiceMock).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalledWith();
      expect(mockResponse.json).not.toHaveBeenCalledWith();
      expect.assertions(4);
    });
  });

  describe('getWorkerDataByDate', () => {
    beforeEach(() => {
      jest.mock('../../../src/services/admin.service');

      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should get worker data based on a specific date', async () => {
      mockRequest.params = { date: '2023-09-01' };
      const { day, month, year, nextDay } = await validateDate(mockRequest.params.date);

      const mockWorkerData = [
        {
          workerId: '64f227c58748a162bc8519d0',
          status: 'active',
          percentage: 50,
        },
        {
          workerId: '64f227fd8748a162bc8519d1',
          status: 'active',
          percentage: 50,
        },
        {
          workerId: '64f25fc78748a162bc851a00',
          status: 'inactive',
          percentage: 0,
        },
      ];

      const workerDataByDateServiceMock = jest.spyOn(AdminService, 'workerDataByDate');
      workerDataByDateServiceMock.mockResolvedValue(mockWorkerData as any);

      await AdminController.workerDataByDate(
        mockRequest as express.Request,
        mockResponse as express.Response,
        mockNext as express.NextFunction,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(workerDataByDateServiceMock).toHaveBeenCalledWith(day, month, year, nextDay);
    });

    it('should throw an error if the params are invalid', async () => {
      mockRequest.params = {
        date: 'bad data',
      } as any;

      const workerDataByDateServiceMock = jest.spyOn(AdminService, 'workerDataByDate');

      await expect(
        AdminController.workerDataByDate(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(workerDataByDateServiceMock).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalledWith();
      expect(mockResponse.json).not.toHaveBeenCalledWith();
      expect.assertions(4);
    });
  });

  describe('editWorkerStatus', () => {
    beforeEach(() => {
      jest.mock('../../../src/services/admin.service');

      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should update a worker status', async () => {
      mockRequest.params = { id: '64f227c58748a162bc8519d0' };

      const editWorkerStatusServiceMock = jest.spyOn(AdminService, 'workerStatus');
      editWorkerStatusServiceMock.mockResolvedValue('Worker status updated to active');

      await AdminController.workerStatus(
        mockRequest as express.Request,
        mockResponse as express.Response,
        mockNext as express.NextFunction,
      );

      expect(editWorkerStatusServiceMock).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(201);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Worker status updated',
        data: 'Worker status updated to active',
        status: 201,
      });
    });

    it('should throw an error if the id is invalid', async () => {
      mockRequest.params = { id: 'invalid id' };

      const editWorkerStatusServiceMock = jest.spyOn(AdminService, 'workerStatus');

      await expect(
        AdminController.workerStatus(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(editWorkerStatusServiceMock).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalledWith();
      expect(mockResponse.json).not.toHaveBeenCalledWith();
      expect.assertions(4);
    });
  });

  describe('deleteOrder', () => {
    beforeEach(() => {
      jest.mock('../../../src/services/admin.service');

      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should delete an order', async () => {
      mockRequest.params = { id: '64f227c58748a162bc8519d0' };
      const date = new Date('2023-09-01');

      const deleteOrderServiceMock = jest.spyOn(OrderService, 'deleteOrder');
      deleteOrderServiceMock.mockResolvedValue({
        address: 'casa 13, CABA',
        coords: {
          lat: -34.603722,
          lng: -58.381592,
        },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Juan Perez',
        status: 'unassigned',
        deliveryDate: '2023-09-01',
      } as any);

      await AdminController.orderToRemove(
        mockRequest as express.Request,
        mockResponse as express.Response,
        mockNext as express.NextFunction,
      );
      expect(deleteOrderServiceMock).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Order request processed',
        data: 'Order deleted',
        status: 201,
      });
    });

    it('should throw an error if the id is invalid', async () => {
      mockRequest.params = { id: 'invalid id' };

      const deleteOrderServiceMock = jest.spyOn(OrderService, 'deleteOrder');

      await expect(
        AdminController.orderToRemove(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(deleteOrderServiceMock).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalledWith();
      expect(mockResponse.json).not.toHaveBeenCalledWith();
      expect.assertions(4);
    });
  });
  describe('getWorkerDataById', () => {
    beforeEach(() => {
      jest.mock('../../../src/services/admin.service');

      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should get data by worker id', async () => {
      mockRequest.params = { id: '64f227c58748a162bc8519d0' };

      const mockWorkerDataById = [
        {
          workerId: '64f227c58748a162bc8519d0',
          status: 'active',
          deliveredOrders: [
            {
              orderId: '64f2292d8748a162bc8519db',
              address: {
                lat: 40.7128,
                lng: -74.006,
              },
            },
          ],
          pendingOrders: [
            {
              orderId: '64f228f48748a162bc8519da',
              address: {
                lat: 40.7128,
                lng: -74.006,
              },
            },
          ],
        },
      ];

      const workerDataByIdServiceMock = jest.spyOn(AdminService, 'workerDataById');
      workerDataByIdServiceMock.mockResolvedValue(mockWorkerDataById as any);

      await AdminController.workerDataById(
        mockRequest as express.Request,
        mockResponse as express.Response,
        mockNext as express.NextFunction,
      );

      expect(workerDataByIdServiceMock).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successful data request',
        data: mockWorkerDataById,
        status: 200,
      });
    });

    it('should throw an error if the date is invalid', async () => {
      mockRequest.params = { id: 'invalid id' as any };

      const workerDataByIdServiceMock = jest.spyOn(AdminService, 'workerDataById');

      await expect(
        AdminController.workerDataByDate(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(workerDataByIdServiceMock).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalledWith();
      expect(mockResponse.json).not.toHaveBeenCalledWith();
      expect.assertions(4);
    });
  });

  describe('getOrderDataByDate', () => {
    beforeEach(() => {
      jest.mock('../../../src/services/admin.service');

      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should get order data based on a specific date', async () => {
      mockRequest.params = { date: '2023-09-01' };
      const { day, month, year } = await validateDate(mockRequest.params.date);

      const mockOrderData = [
        {
          id: '64f1f64d767929ccaeb66875',
          address: 'casa 1312, CABA',
        },
        {
          id: '64f1fa06767929ccaeb66877',
          address: 'casa 13, CABA',
        },
        {
          id: '64f5c55e80ba31a238ab5894',
          address: 'casa 13, CABA',
        },
        {
          id: '64f5c57f74cafe7c05473bca',
          address: 'casa 13, CABA',
        },
        {
          id: '64f5c63b74cafe7c05473bcc',
          address: 'casa 13, CABA',
        },
        {
          id: '64f5c642e6e61be2295da5bd',
          address: 'casa 13, CABA',
        },
        {
          id: '64f5c674d844219dbf5ffb48',
          address: 'casa 13, CABA',
        },
        {
          id: '64f5c69107c2302c5ff1ed52',
          address: 'casa 13, CABA',
        },
        {
          id: '64f5f9f5aa46383212acbc5c',
          address: 'casa 13, CABA',
        },
      ];

      const orderDataByDateServiceMock = jest.spyOn(AdminService, 'orderDataByDate');
      orderDataByDateServiceMock.mockResolvedValue(mockOrderData as any);

      await AdminController.orderDataByDate(
        mockRequest as express.Request,
        mockResponse as express.Response,
        mockNext as express.NextFunction,
      );

      expect(orderDataByDateServiceMock).toHaveBeenCalledWith(day, month, year);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Successful data request',
        data: mockOrderData,
        status: 200,
      });

      expect.assertions(3);
    });

    it('should throw an error if the query params are invalid', async () => {
      mockRequest.params = {
        date: 'bad data',
      } as any;

      const orderDataByDateServiceMock = jest.spyOn(AdminService, 'orderDataByDate');

      await expect(
        AdminController.orderDataByDate(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(orderDataByDateServiceMock).not.toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalledWith();
      expect(mockResponse.json).not.toHaveBeenCalledWith();
      expect.assertions(4);
    });
  });
});
