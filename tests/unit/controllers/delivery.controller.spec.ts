import { DeliveryController } from '@/controllers/delivery.controller';
import express from 'express';
import { ObjectId } from 'mongodb';
import DeliveryService from '@/services/delivery.service';

describe('DeliveryController', () => {
  let mockRequest: Partial<express.Request>;
  let mockResponse: Partial<express.Response>;
  let mockNext: express.NextFunction;

  beforeAll(() => {
    jest.mock('@/services/delivery.service');
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
        destinationLocation: {
          lat: 123.456,
          lng: 789.012,
        },
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
      expect(DeliveryService.createDelivery).toHaveBeenCalledWith(mockRequest.body);
      expect.assertions(4);
    });

    it('should throw an error if the request body is invalid', async () => {
      mockRequest.body = {
        destinationLocation: 'bad data',
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

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(DeliveryService.createDelivery).not.toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Request body types are invalid',
        data: mockRequest.body,
        status: 400,
      });
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
        expect(DeliveryService.createDelivery).not.toHaveBeenCalled();
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
        destinationLocation: {
          lat: 123.456,
          lng: 789.012,
        },
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
      expect(DeliveryService.createDelivery).not.toHaveBeenCalled();
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
      expect(DeliveryService.getDelivery).toHaveBeenCalledWith(mockRequest.params.id);
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
      expect(DeliveryService.getDelivery).not.toHaveBeenCalled();
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
        expect(DeliveryService.getDelivery).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expectedMessage,
          data: mockRequest.params.id,
          status: expectedStatus,
        });
        expect.assertions(4);
      });
    });

    describe('getDeliveries', () => {
      it('should get all deliveries', async () => {
        const mockDeliveries = [
          {
            _id: new ObjectId(),
            destinationLocation: {
              lat: 123.456,
              lng: 789.012,
            },
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
        expect(mockResponse.json).toHaveBeenCalledWith(mockDeliveries);
      });
    });

    // describe('updateDelivery', () => {
    //   it('should update a delivery', async () => {
    //     const mockId = new ObjectId();

    //     const mockRequestBody = {
    //       destinationLocation: {
    //         lat: 123.456,
    //         lng: 789.012,
    //       },
    //       orderId: new ObjectId(),
    //       userId: new ObjectId(),
    //     };

    //     await DeliveryController.updateDelivery(
    //       mockRequest as express.Request,
    //       mockResponse as express.Response,
    //       mockNext as express.NextFunction,
    //     );

    //     // Validar el estado y la respuesta aquí si es necesario
    //     expect(mockResponse.status).toHaveBeenCalledWith(200);
    //     expect(mockResponse.json).toHaveBeenCalledWith({ id: mockId, ...mockRequestBody });
    //   });
    // });

    // describe('deleteDelivery', () => {
    //   it('should delete a delivery', async () => {
    //     const mockId = new ObjectId();

    //     await DeliveryController.deleteDelivery(
    //       mockRequest as express.Request,
    //       mockResponse as express.Response,
    //       mockNext as express.NextFunction,
    //     );

    //     // Validar el estado y la respuesta aquí si es necesario
    //     expect(mockResponse.status).toHaveBeenCalledWith(200);
    //     expect(mockResponse.json).toHaveBeenCalledWith({ id: mockId });
    //   });
    // });

    // describe('getDeliveriesByUser', () => {
    //   it('should get all deliveries by user', async () => {
    //     const mockId = new ObjectId();

    //     const mockDeliveries = [
    //       {
    //         _id: new ObjectId(),
    //         destinationLocation: {
    //           lat: 123.456,
    //           lng: 789.012,
    //         },
    //         orderId: new ObjectId(),
    //         userId: mockId,
    //       },
    //       // Agrega más entregas si es necesario
    //     ];

    //     await DeliveryController.getDeliveriesByUser(
    //       mockRequest as express.Request,
    //       mockResponse as express.Response,
    //       mockNext as express.NextFunction,
    //     );

    //     // Validar el estado y la respuesta aquí si es necesario
    //     expect(mockResponse.status).toHaveBeenCalledWith(200);
    //     expect(mockResponse.json).toHaveBeenCalledWith(mockDeliveries);
    //   });
    // });
    // describe('patchDelivery', () =>
    //   it('should patch a delivery', async () => {
    //     const mockId = new ObjectId();

    //     const mockRequestBody = {
    //       destinationLocation: {
    //         lat: 123.456,
    //         lng: 789.012,
    //       },
    //       orderId: new ObjectId(),
    //       userId: new ObjectId(),
    //     };

    //     await DeliveryController.patchDelivery(
    //       mockRequest as express.Request,
    //       mockResponse as express.Response,
    //       mockNext as express.NextFunction,
    //     );

    //     // Validar el estado y la respuesta aquí si es necesario
    //     expect(mockResponse.status).toHaveBeenCalledWith(200);
    //     expect(mockResponse.json).toHaveBeenCalledWith({ id: mockId, ...mockRequestBody });
    //   }))
  });
});
