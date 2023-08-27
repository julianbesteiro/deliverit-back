import { DeliveryController } from '@/controllers/delivery.controller';
import express from 'express';
import { ObjectId } from 'mongodb';

import DeliveryService from '@/services/delivery.service';

jest.mock('@/services/delivery.service');

describe('DeliveryController', () => {
  let mockRequest: Partial<express.Request>;
  let mockResponse: Partial<express.Response>;
  let mockNext: express.NextFunction;
  let deliveryService: DeliveryService;

  beforeAll(() => {
    deliveryService = new DeliveryService({} as any);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('createDelivery', () => {
    beforeEach(() => {
      mockRequest = { body: {}, params: {} };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    it('should create a delivery', async () => {
      mockRequest.body = {
        orderId: new ObjectId(),
        userId: new ObjectId(),
      };

      await expect(
        DeliveryController.createDelivery(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Delivery created',
        data: mockRequest.body,
        status: 201,
      });
      expect(deliveryService.createDelivery).toHaveBeenCalledWith(mockRequest.body);
      expect.assertions(4);
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
          DeliveryController.createDelivery(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(deliveryService.createDelivery).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expectedMessage,
          data: mockRequest.body,
          status: expectedStatus,
        });
        expect.assertions(3);
      });
    });

    it('should throw an error if the orderId an userId are ivalid ObjectId of mongodb', async () => {
      mockRequest.body = {
        orderId: 'invalid id',
        userId: 'invalid id',
      };

      await expect(
        DeliveryController.createDelivery(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(deliveryService.createDelivery).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid ObjectId',
        data: mockRequest.body,
        status: 400,
      });
      expect.assertions(4);
    });
  });

  describe('getDelivery', () => {
    beforeEach(() => {
      mockRequest = { body: {}, params: {} };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    it('should get a delivery', async () => {
      mockRequest.params = { id: new ObjectId() as any };

      await expect(
        DeliveryController.getDelivery(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(deliveryService.getDelivery).toHaveBeenCalledWith(mockRequest.params.id);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Delivery found',
        data: mockRequest.params.id,
        status: 200,
      });
      expect.assertions(4);
    });

    it('should throw an error if the id is invalid', async () => {
      mockRequest.params = { id: 'invalid id' as any };

      await expect(
        DeliveryController.getDelivery(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(deliveryService.getDelivery).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid ObjectId',
        data: mockRequest.params.id,
        status: 400,
      });
      expect.assertions(4);
    });

    const testCases = [
      {
        description: 'should throw an error if the id is empty',
        id: '',
        expectedStatus: 400,
        expectedMessage: 'Invalid ObjectId',
      },
      {
        description: 'should throw an error if the id is null',
        id: null,
        expectedStatus: 400,
        expectedMessage: 'Invalid ObjectId',
      },
      {
        description: 'should throw an error if the id is undefined',
        id: undefined,
        expectedStatus: 400,
        expectedMessage: 'Invalid ObjectId',
      },
    ];

    testCases.forEach(({ description, id, expectedStatus, expectedMessage }) => {
      it(description, async () => {
        mockRequest.params = { id: id as any };

        await expect(
          DeliveryController.getDelivery(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(deliveryService.getDelivery).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expectedMessage,
          data: mockRequest.params.id,
          status: expectedStatus,
        });
        expect.assertions(4);
      });
    });
  });

  describe('getDeliveries', () => {
    beforeEach(() => {
      mockRequest = { body: {}, params: {}, query: {} };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    it('should get all deliveries', async () => {
      mockRequest.query = {
        limit: 10,
        page: 1,
        status: 'pending',
      } as any;

      const mockDeliveries = [
        {
          orderId: new ObjectId(),
          userId: new ObjectId(),
        },
        // Agrega más entregas si es necesario
      ];

      await DeliveryController.getDeliveries(
        mockRequest as express.Request,
        mockResponse as express.Response,
        mockNext as express.NextFunction,
      );

      // Validar el estado y la respuesta aquí si es necesario
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(deliveryService.getDeliveries).toHaveBeenCalledWith(mockRequest.query);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Deliveries found',
        data: mockDeliveries,
        status: 200,
      });
    });

    it('should throw an error if the query params are invalid', async () => {
      mockRequest.query = {
        limit: 'bad data',
        page: 'bad data',
        status: 'bad data',
      } as any;

      await expect(
        DeliveryController.getDeliveries(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(deliveryService.getDeliveries).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Query params types are invalid',
        data: mockRequest.query,
        status: 400,
      });
      expect.assertions(4);
    });

    const testCases = [
      {
        description: 'should throw an error if the query params are empty',
        query: {},
        expectedStatus: 400,
        expectedMessage: 'Query params are empty',
      },
      {
        description: 'should throw an error if the query params are null',
        query: null,
        expectedStatus: 400,
        expectedMessage: 'Query params are empty',
      },
      {
        description: 'should throw an error if the query params are undefined',
        query: undefined,
        expectedStatus: 400,
        expectedMessage: 'Query params are empty',
      },
    ];

    testCases.forEach(({ description, query, expectedStatus, expectedMessage }) => {
      it(description, async () => {
        mockRequest.query = query as any;

        await expect(
          DeliveryController.getDeliveries(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(deliveryService.getDeliveries).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expectedMessage,
          data: mockRequest.query,
          status: expectedStatus,
        });
        expect.assertions(3);
      });
    });
  });

  describe('updateDelivery', () => {
    beforeEach(() => {
      mockRequest = { body: {}, params: {} };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    it('should update a delivery', async () => {
      mockRequest.params = { id: new ObjectId() } as any;

      mockRequest.body = {
        status: 'delivered',
        orderId: new ObjectId(),
        userId: new ObjectId(),
        startinLocation: {
          lat: 123.456,
          lng: 789.012,
        },
        destinationLocation: {
          lat: 123.456,
          lng: 789.012,
        },
        startingDate: new Date(),
        resolutionDate: new Date(),
      };

      await DeliveryController.updateDelivery(
        mockRequest as express.Request,
        mockResponse as express.Response,
        mockNext as express.NextFunction,
      );

      // Validar el estado y la respuesta aquí si es necesario
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Delivery updated',
        data: { ...mockRequest.params, ...mockRequest.body },
        status: 200,
      });
    });

    it('should throw an error if the id is invalid', async () => {
      mockRequest.params = { id: 'invalid id' as any };

      await expect(
        DeliveryController.updateDelivery(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(deliveryService.updateDelivery).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid ObjectId',
        data: mockRequest.params.id,
        status: 400,
      });
      expect.assertions(4);
    });

    const testCases = [
      {
        description: 'should throw an error if the id is empty',
        id: '',
        expectedStatus: 400,
        expectedMessage: 'Invalid ObjectId',
      },
      {
        description: 'should throw an error if the id is null',
        id: null,
        expectedStatus: 400,
        expectedMessage: 'Invalid ObjectId',
      },
      {
        description: 'should throw an error if the id is undefined',
        id: undefined,
        expectedStatus: 400,
        expectedMessage: 'Invalid ObjectId',
      },
    ];

    testCases.forEach(({ description, id, expectedStatus, expectedMessage }) => {
      it(description, async () => {
        mockRequest.params = { id: id as any };

        await expect(
          DeliveryController.updateDelivery(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(deliveryService.updateDelivery).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expectedMessage,
          data: mockRequest.params.id,
          status: expectedStatus,
        });
        expect.assertions(4);
      });
    });

    const testCases2 = [
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

    testCases2.forEach(({ description, requestBody, expectedStatus, expectedMessage }) => {
      it(description, async () => {
        mockRequest.body = requestBody;

        await expect(
          DeliveryController.updateDelivery(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(deliveryService.updateDelivery).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expectedMessage,
          data: mockRequest.body,
          status: expectedStatus,
        });
        expect.assertions(3);
      });
    });

    it('should throw an error if the orderId an userId are ivalid ObjectId of mongodb', async () => {
      mockRequest.body = {
        orderId: 'invalid id',
        userId: 'invalid id',
      };

      await expect(
        DeliveryController.updateDelivery(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(deliveryService.updateDelivery).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid ObjectId',
        data: mockRequest.body,
        status: 400,
      });
      expect.assertions(4);
    });
  });

  describe('deleteDelivery', () => {
    beforeEach(() => {
      mockRequest = { body: {}, params: {} };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    it('should delete a delivery', async () => {
      mockRequest.params = { id: new ObjectId() } as any;

      await DeliveryController.deleteDelivery(
        mockRequest as express.Request,
        mockResponse as express.Response,
        mockNext as express.NextFunction,
      );

      // Validar el estado y la respuesta aquí si es necesario
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Delivery deleted',
        data: { ...mockRequest.params },
        status: 200,
      });
    });

    it('should throw an error if the id is invalid', async () => {
      mockRequest.params = { id: 'invalid id' as any };

      await expect(
        DeliveryController.deleteDelivery(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(deliveryService.deleteDelivery).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid ObjectId',
        data: mockRequest.params.id,
        status: 400,
      });
      expect.assertions(4);
    });
  });

  describe('getDeliveriesByUser', () => {
    beforeEach(() => {
      mockRequest = { body: {}, params: {}, query: {} };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    it('should get all deliveries by user', async () => {
      mockRequest.params = { userId: new ObjectId() } as any;

      mockRequest.query = {
        limit: 10,
        page: 1,
        status: 'pending',
      } as any;

      const mockDeliveries = [
        {
          _id: new ObjectId(),
          orderId: new ObjectId(),
          ...mockRequest.params,
        },
        // Agrega más entregas si es necesario
      ];

      await DeliveryController.getDeliveriesByUser(
        mockRequest as express.Request,
        mockResponse as express.Response,
        mockNext as express.NextFunction,
      );

      // Validar el estado y la respuesta aquí si es necesario
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(deliveryService.getDeliveriesByUser).toHaveBeenCalledWith({
        ...mockRequest.params,
        ...mockRequest.query,
      });
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Deliveries found',
        data: mockDeliveries,
        status: 200,
      });
    });

    it('should throw an error if the userId is invalid', async () => {
      mockRequest.params = { userId: 'invalid id' as any };

      await expect(
        DeliveryController.getDeliveriesByUser(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(deliveryService.getDeliveriesByUser).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid ObjectId',
        data: mockRequest.params.userId,
        status: 400,
      });
      expect.assertions(4);
    });

    const testCases = [
      {
        description: 'should throw an error if the userId is empty',
        userId: '',
        expectedStatus: 400,
        expectedMessage: 'Invalid ObjectId',
      },
      {
        description: 'should throw an error if the userId is null',
        userId: null,
        expectedStatus: 400,
        expectedMessage: 'Invalid ObjectId',
      },
      {
        description: 'should throw an error if the userId is undefined',
        userId: undefined,
        expectedStatus: 400,
        expectedMessage: 'Invalid ObjectId',
      },
    ];

    testCases.forEach(({ description, userId, expectedStatus, expectedMessage }) => {
      it(description, async () => {
        mockRequest.params = { userId: userId as any };

        await expect(
          DeliveryController.getDeliveriesByUser(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(deliveryService.getDeliveriesByUser).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expectedMessage,
          data: mockRequest.params.userId,
          status: expectedStatus,
        });
        expect.assertions(4);
      });
    });

    it('should throw an error if the query params are invalid', async () => {
      mockRequest.query = {
        limit: 'bad data',
        page: 'bad data',
        status: 'bad data',
      } as any;

      await expect(
        DeliveryController.getDeliveriesByUser(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(deliveryService.getDeliveriesByUser).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Query params types are invalid',
        data: mockRequest.query,
        status: 400,
      });
      expect.assertions(4);
    });
  });

  describe('patchDelivery', () => {
    beforeEach(() => {
      mockRequest = { body: {}, params: {} };
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });

    it('should patch a delivery', async () => {
      mockRequest.params = { id: new ObjectId() } as any;

      mockRequest.body = {
        status: 'delivered',
      };

      await DeliveryController.patchDelivery(
        mockRequest as express.Request,
        mockResponse as express.Response,
        mockNext as express.NextFunction,
      );

      // Validar el estado y la respuesta aquí si es necesario
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(deliveryService.patchDelivery).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Delivery patched',
        data: { ...mockRequest.params, ...mockRequest.body },
        status: 200,
      });
    });

    it('should throw an error if the id is invalid', async () => {
      mockRequest.params = { id: 'invalid id' as any };

      await expect(
        DeliveryController.patchDelivery(
          mockRequest as express.Request,
          mockResponse as express.Response,
          mockNext as express.NextFunction,
        ),
      ).resolves.toBeUndefined();

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(deliveryService.patchDelivery).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid ObjectId',
        data: mockRequest.params.id,
        status: 400,
      });
      expect.assertions(4);
    });

    const testCases = [
      {
        description: 'should throw an error if the id is empty',
        id: '',
        expectedStatus: 400,
        expectedMessage: 'Invalid ObjectId',
      },
      {
        description: 'should throw an error if the id is null',
        id: null,
        expectedStatus: 400,
        expectedMessage: 'Invalid ObjectId',
      },
      {
        description: 'should throw an error if the id is undefined',
        id: undefined,
        expectedStatus: 400,
        expectedMessage: 'Invalid ObjectId',
      },
    ];

    testCases.forEach(({ description, id, expectedStatus, expectedMessage }) => {
      it(description, async () => {
        mockRequest.params = { id: id as any };

        await expect(
          DeliveryController.patchDelivery(
            mockRequest as express.Request,
            mockResponse as express.Response,
            mockNext as express.NextFunction,
          ),
        ).resolves.toBeUndefined();

        expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
        expect(deliveryService.patchDelivery).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expectedMessage,
          data: mockRequest.params.id,
          status: expectedStatus,
        });
        expect.assertions(4);
      });
    });
  });
});
