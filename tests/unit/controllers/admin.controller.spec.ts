import { AdminController } from '@/controllers/admin.controller';
import express from 'express';
import { ObjectId } from 'mongodb';
import AdminService from '@/services/admin.service';
import { IDeliveryForTesting } from '@/interfaces';
import { IWorker } from '@/interfaces';

//utils
const ordersCheck = (orders: Array<IDeliveryForTesting>) => {
  expect(Array.isArray(orders)).toEqual(true);

  if (orders.length > 0) {
    orders.forEach((order) => {
      expect(Object.keys(order).length).toEqual(2);
      expect(order).toEqual({
        orderId: expect.any(Number),
        address: expect.any(String),
      });
    });
  }

  const orderIdsArray = Object.values(orders.map((order) => order.orderId));
  const uniqueOrderIdsArray = [...new Set(orderIdsArray)];

  expect(orderIdsArray).toEqual(uniqueOrderIdsArray);
};

//TESTS

describe('AdminController', () => {
  let mockRequest: Partial<express.Request>;
  let mockResponse: Partial<express.Response>;
  let mockNext: express.NextFunction;

  beforeAll(() => {
    jest.mock('@/services/admin.service');
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    beforeEach(() => {
      mockRequest = { body: {} };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    it('should create an order', async () => {
      mockRequest.body = {
        address: 'casa 1312, CABA',
        coords: { lat: -34.603722, lng: -58.381592 },
        packagesQuantity: 3,
        weight: 2,
        recipient: 'Juan Perez',
      };

      await expect(
        AdminController.newOrder(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Order created',
        data: mockRequest.body,
        status: 201,
      });
      expect(AdminService.newOrder).toHaveBeenCalledWith(mockRequest.body);
      expect.assertions(4);
    });

    it('should throw an error if the request body is invalid', async () => {
      mockRequest.body = {
        address: 231,
        coords: 123123,
        packagesQuantity: 'test',
        weight: 'test',
        recipient: 1231,
      };

      await expect(
        AdminController.newOrder(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(AdminService.newOrder).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Request body types are invalid',
        data: mockRequest.body,
        status: 400,
      });

      let responseJsonDataNewOrder;

      if (mockResponse.json) {
        const jsonMockCalls = (mockResponse.json as jest.Mock).mock.calls;
        [responseJsonDataNewOrder] = jsonMockCalls[0];
      }

      expect(responseJsonDataNewOrder.data).toEqual({
        address: expect.any(String),
        coords: expect.any(Number),
        packagesQuantity: expect.any(Object),
        weight: expect.any(Number),
        recipient: expect.any(String),
      });

      expect(responseJsonDataNewOrder.data.packagesQuantity).toEqual(
        expect.objectContaining({ lat: expect.any(Number), lng: expect.any(Number) }),
      );

      expect(Object.keys(responseJsonDataNewOrder.data).length).toEqual(5);

      expect(typeof responseJsonDataNewOrder.data).toEqual('object');

      expect.assertions(8);
    });

    const testCases = [
      {
        description: 'should throw an error if the request body is empty',
        requestBody: {},
        expectedStatus: 400,
        expectedMessage: 'Request body is empty',
      },
      {
        description: 'should throw an error if the request body is null',
        requestBody: null,
        expectedStatus: 400,
        expectedMessage: 'Request body is empty',
      },
      {
        description: 'should throw an error if the request body is undefined',
        requestBody: undefined,
        expectedStatus: 400,
        expectedMessage: 'Request body is empty',
      },
    ];

    testCases.forEach(({ description, requestBody, expectedStatus, expectedMessage }) => {
      it(description, async () => {
        mockRequest.body = requestBody;

        await expect(
          AdminController.newOrder(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(AdminService.newOrder).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expectedMessage,
          data: mockRequest.body,
          status: expectedStatus,
        });
        expect.assertions(3);
      });
    });
  });

  describe('getDataByDate', () => {
    beforeEach(() => {
      mockRequest = { params: {} };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    it('should get analytics based on a specific date', async () => {
      mockRequest.params = { date: Date as any };

      const mockDataByDate = {
        availableWorkers: 4,
        activeWorkers: 2,
        availableOrders: 6,
        deliveredOrders: 5,
      };

      await expect(
        AdminController.dataByDate(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(AdminService.dataByDate).toHaveBeenCalledWith(mockRequest.params.date);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Data found',
        data: mockDataByDate,
        status: 200,
      });

      let responseJsonDataByDate;

      if (mockResponse.json) {
        const jsonMockCalls = (mockResponse.json as jest.Mock).mock.calls;
        [responseJsonDataByDate] = jsonMockCalls[0];
      }
      expect(responseJsonDataByDate.data).toEqual({
        availableWorkers: expect.any(Number),
        activeWorkers: expect.any(Number),
        availableOrders: expect.any(Number),
        deliveredOrders: expect.any(Number),
      });

      expect(responseJsonDataByDate.data.activeWorkers).toBeLessThanOrEqual(
        responseJsonDataByDate.data.availableWorkers,
      );

      expect(responseJsonDataByDate.data.deliveredOrders).toBeLessThanOrEqual(
        responseJsonDataByDate.data.availableOrders,
      );

      expect(Object.keys(responseJsonDataByDate.data).length).toEqual(4);

      expect(typeof responseJsonDataByDate.data).toEqual('object');

      expect.assertions(9);
    });

    it('should throw an error if the date is invalid', async () => {
      mockRequest.params = { date: 34234 as any };

      await expect(
        AdminController.dataByDate(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(AdminService.dataByDate).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid Date',
        data: mockRequest.params.date,
        status: 400,
      });
      expect.assertions(4);
    });

    const testCases = [
      {
        description: 'should throw an error if the date is empty',
        date: '',
        expectedStatus: 400,
        expectedMessage: 'Invalid Date',
      },
      {
        description: 'should throw an error if the date is null',
        date: null,
        expectedStatus: 400,
        expectedMessage: 'Invalid Date',
      },
      {
        description: 'should throw an error if the date is undefined',
        date: undefined,
        expectedStatus: 400,
        expectedMessage: 'Invalid Date',
      },
    ];

    testCases.forEach(({ description, date, expectedStatus, expectedMessage }) => {
      it(description, async () => {
        mockRequest.params = { date: date as any };

        await expect(
          AdminController.dataByDate(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(AdminService.dataByDate).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expectedMessage,
          data: mockRequest.params.date,
          status: expectedStatus,
        });
        expect.assertions(4);
      });
    });

    describe('getWorkerDataByDate', () => {
      beforeEach(() => {
        mockRequest = { params: {} };
        mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        mockNext = jest.fn();
      });

      it('should get worker data based on a specific date', async () => {
        mockRequest.params = { date: new Date() as any };

        const mockWorkerData = [
          { workerId: 12312, status: 'active', percentage: 100 },
          { workerId: 12313, status: 'active', percentage: 91 },
          { workerId: 12314, status: 'inactive', percentage: 0 },
        ];

        await AdminController.workerDataByDate(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        );

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(AdminService.workerDataByDate).toHaveBeenCalledWith(mockRequest.params);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Worker data found',
          data: mockWorkerData,
          status: 200,
        });

        let responseJsonDataWorkerByDate;

        if (mockResponse.json) {
          const jsonMockCalls = (mockResponse.json as jest.Mock).mock.calls;
          [responseJsonDataWorkerByDate] = jsonMockCalls[0];
        }

        expect(Array.isArray(responseJsonDataWorkerByDate.data)).toEqual(true);
        if (responseJsonDataWorkerByDate.length > 0) {
          responseJsonDataWorkerByDate.forEach((worker: IWorker) => {
            expect(Object.keys(worker).length).toEqual(3);
            expect(worker).toEqual({
              workerId: expect.any(Number),
              status: expect.any(String),
              percentage: expect.any(Number),
            });
            expect(worker.status).toMatch(/^(active|inactive)$/);
            expect(worker.percentage).toBeLessThanOrEqual(100);

            if (worker.status === 'inactive') {
              expect(worker.percentage).toEqual(0);
            }
          });
        }

        const workerIdsArray = Object.values(
          responseJsonDataWorkerByDate.map((worker: IWorker) => worker.workerId),
        );
        const uniqueWorkerIdsArray = [...new Set(workerIdsArray)];

        expect(workerIdsArray).toEqual(uniqueWorkerIdsArray);
      });

      it('should throw an error if the params are invalid', async () => {
        mockRequest.params = {
          date: 'bad data',
        } as any;

        await expect(
          AdminController.workerDataByDate(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(AdminService.workerDataByDate).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Date in params is invalid',
          data: mockRequest.params,
          status: 400,
        });
        expect.assertions(4);
      });

      const testCases = [
        {
          description: 'should throw an error if the params are empty',
          params: {},
          expectedStatus: 400,
          expectedMessage: 'Params are empty',
        },
        {
          description: 'should throw an error if the params are null',
          params: null,
          expectedStatus: 400,
          expectedMessage: 'Params are empty',
        },
        {
          description: 'should throw an error if the params are undefined',
          params: undefined,
          expectedStatus: 400,
          expectedMessage: 'Params are empty',
        },
      ];

      testCases.forEach(({ description, params, expectedStatus, expectedMessage }) => {
        it(description, async () => {
          mockRequest.params = params as any;

          await expect(
            AdminController.workerDataByDate(
              mockRequest as express.Request,
              mockResponse as express.Response,
              mockNext as express.NextFunction,
            ),
          ).resolves.toBeUndefined();

          expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
          expect(AdminService.workerDataByDate).not.toHaveBeenCalled();
          expect(mockResponse.json).toHaveBeenCalledWith({
            message: expectedMessage,
            data: mockRequest.params,
            status: expectedStatus,
          });
          expect.assertions(3);
        });
      });
    });

    describe('editWorkerStatus', () => {
      beforeEach(() => {
        mockRequest = { params: {} };
        mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        mockNext = jest.fn();
      });

      it('should update a worker status', async () => {
        mockRequest.params = { id: new ObjectId() } as any;

        await AdminController.workerStatus(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        );

        expect(mockResponse.status).toHaveBeenCalledWith(200);

        const mockWorkerStatus = 'active' || 'inactive';

        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Worker status updated',
          data: { id: mockRequest.params, mockWorkerStatus },
          status: 200,
        });
      });

      it('should throw an error if the id is invalid', async () => {
        mockRequest.params = { id: 'invalid id' as any };

        await expect(
          AdminController.workerStatus(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(AdminService.workerStatus).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Invalid id',
          data: mockRequest.params.id,
          status: 400,
        });
        expect.assertions(4);
      });

      const testCases = [
        {
          description: 'should throw an error if the params is empty',
          params: '',
          expectedStatus: 400,
          expectedMessage: 'Invalid ObjectId',
        },
        {
          description: 'should throw an error if the params is null',
          params: null,
          expectedStatus: 400,
          expectedMessage: 'Invalid ObjectId',
        },
        {
          description: 'should throw an error if the params is undefined',
          params: undefined,
          expectedStatus: 400,
          expectedMessage: 'Invalid ObjectId',
        },
      ];

      testCases.forEach(({ description, params, expectedStatus, expectedMessage }) => {
        it(description, async () => {
          mockRequest.params = params as any;

          await expect(
            AdminController.workerStatus(
              mockRequest as express.Request,
              mockResponse as express.Response,
              mockNext as express.NextFunction,
            ),
          ).resolves.toBeUndefined();

          expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
          expect(AdminController.workerStatus).not.toHaveBeenCalled();
          expect(mockResponse.json).toHaveBeenCalledWith({
            message: expectedMessage,
            data: mockRequest.params,
            status: expectedStatus,
          });
          expect.assertions(4);
        });
      });

      it('should throw an error if the userId is an invalid ObjectId of mongodb', async () => {
        mockRequest.params = {
          userId: 'invalid id',
        };

        await expect(
          AdminController.workerStatus(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(AdminController.workerStatus).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Invalid ObjectId',
          id: mockRequest.params,
          status: 400,
        });
        expect.assertions(4);
      });
    });

    describe('deleteOrder', () => {
      beforeEach(() => {
        mockRequest = { params: {} };
        mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        mockNext = jest.fn();
      });

      it('should delete an order', async () => {
        mockRequest.params = { id: new ObjectId() } as any;

        await AdminController.orderToRemove(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        );

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Order deleted',
          data: { ...mockRequest.params },
          status: 200,
        });
      });

      it('should throw an error if the id is invalid', async () => {
        mockRequest.params = { id: 'invalid id' as any };

        await expect(
          AdminController.orderToRemove(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(AdminController.orderToRemove).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Invalid ObjectId',
          data: mockRequest.params.id,
          status: 400,
        });
        expect.assertions(4);
      });
    });

    describe('getWorkerDataById', () => {
      beforeEach(() => {
        mockRequest = { params: {} };
        mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        mockNext = jest.fn();
      });

      it('should get data by worker id', async () => {
        mockRequest.params = { id: new ObjectId() } as any;

        const mockWorkerDataById = [
          {
            workerId: 21312,
            status: 'active',
            pendingOrders: [
              { orderId: 2112, address: 'casa 1312, CABA' },
              { orderId: 2113, address: 'casa 1313, CABA' },
              { orderId: 2114, address: 'casa 1314, CABA' },
            ],
            deliveredOrders: [
              { orderId: 2115, address: 'casa 1315, CABA' },
              { orderId: 2116, address: 'casa 1316, CABA' },
            ],
          },
        ];

        await AdminController.workerDataById(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        );

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(AdminController.workerDataByDate).toHaveBeenCalledWith({
          ...mockRequest.params,
        });
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Workers data found',
          data: mockWorkerDataById,
          status: 200,
        });
      });

      it('should throw an error if the date is invalid', async () => {
        mockRequest.params = { id: 'invalid id' as any };

        await expect(
          AdminController.workerDataByDate(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(AdminController.workerDataByDate).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Invalid id',
          data: mockRequest.params.id,
          status: 400,
        });
        expect.assertions(4);

        let responseJsonDataWorkerById;

        if (mockResponse.json) {
          const jsonMockCalls = (mockResponse.json as jest.Mock).mock.calls;
          [responseJsonDataWorkerById] = jsonMockCalls[0];
        }

        expect(typeof responseJsonDataWorkerById.data).toEqual('object');

        expect(Object.keys(responseJsonDataWorkerById.data).length).toEqual(4);

        expect(responseJsonDataWorkerById.data).toEqual({
          workerId: expect.any(Number),
          status: expect.any(String),
          pendingOrders: expect.any(Array),
          deliveredOrders: expect.any(Array),
        });

        expect(responseJsonDataWorkerById.data.status).toMatch(/^(active|inactive)$/);

        ordersCheck(responseJsonDataWorkerById.data.pendingOrders);

        ordersCheck(responseJsonDataWorkerById.data.deliveredOrders);
      });

      const testCases = [
        {
          description: 'should throw an error if the id is empty',
          id: '',
          expectedStatus: 400,
          expectedMessage: 'Invalid date',
        },
        {
          description: 'should throw an error if the id is null',
          id: null,
          expectedStatus: 400,
          expectedMessage: 'Invalid date',
        },
        {
          description: 'should throw an error if the id is undefined',
          id: undefined,
          expectedStatus: 400,
          expectedMessage: 'Invalid date',
        },
      ];

      testCases.forEach(({ description, id, expectedStatus, expectedMessage }) => {
        it(description, async () => {
          mockRequest.params = { id: id as any };

          await expect(
            AdminController.workerDataByDate(
              mockRequest as express.Request,
              mockResponse as express.Response,
              mockNext as express.NextFunction,
            ),
          ).resolves.toBeUndefined();

          expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
          expect(AdminController.workerDataByDate).not.toHaveBeenCalled();
          expect(mockResponse.json).toHaveBeenCalledWith({
            message: expectedMessage,
            date: mockRequest.params.id,
            status: expectedStatus,
          });
          expect.assertions(4);
        });
      });
    });

    describe('getOrderDataByDate', () => {
      beforeEach(() => {
        mockRequest = { params: {} };
        mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        mockNext = jest.fn();
      });

      it('should get order data based on a specific date', async () => {
        mockRequest.params = { date: new Date() as any };

        const mockOrderData = [
          { orderId: 2112, address: 'casa 1312, CABA' },
          { orderId: 2113, address: 'casa 1313, CABA' },
          { orderId: 2114, address: 'casa 1314, CABA' },
        ];

        await AdminController.orderDataByDate(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        );

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(AdminService.orderDataByDate).toHaveBeenCalledWith(mockRequest.query);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Order data found',
          data: mockOrderData,
          status: 200,
        });

        expect.assertions(3);

        let responseJsonDatabyDate;

        if (mockResponse.json) {
          const jsonMockCalls = (mockResponse.json as jest.Mock).mock.calls;
          [responseJsonDatabyDate] = jsonMockCalls[0];
        }

        ordersCheck(responseJsonDatabyDate.data);
      });

      it('should throw an error if the query params are invalid', async () => {
        mockRequest.params = {
          date: 'bad data',
        } as any;

        await expect(
          AdminController.orderDataByDate(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(AdminService.orderDataByDate).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Date in params is invalid',
          data: mockRequest.params,
          status: 400,
        });
      });

      const testCases = [
        {
          description: 'should throw an error if the params are empty',
          params: {},
          expectedStatus: 400,
          expectedMessage: 'Params are empty',
        },
        {
          description: 'should throw an error if the params are null',
          params: null,
          expectedStatus: 400,
          expectedMessage: 'Params are empty',
        },
        {
          description: 'should throw an error if the params are undefined',
          params: undefined,
          expectedStatus: 400,
          expectedMessage: 'Params are empty',
        },
      ];

      testCases.forEach(({ description, params, expectedStatus, expectedMessage }) => {
        it(description, async () => {
          mockRequest.params = params as any;

          await expect(
            AdminController.orderDataByDate(
              mockRequest as express.Request,
              mockResponse as express.Response,
              mockNext as express.NextFunction,
            ),
          ).resolves.toBeUndefined();

          expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
          expect(AdminService.orderDataByDate).not.toHaveBeenCalled();
          expect(mockResponse.json).toHaveBeenCalledWith({
            message: expectedMessage,
            data: mockRequest.params,
            status: expectedStatus,
          });
          expect.assertions(3);
        });
      });
    });
  });
});
