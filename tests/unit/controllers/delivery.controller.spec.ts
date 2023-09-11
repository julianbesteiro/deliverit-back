import { Request, Response } from 'express';
import {
  BaseFilters,
  IDelivery,
  IDeliveryDTO,
  IDeliveryService,
  PaginationData,
} from '../../../src/interfaces';

import { ObjectId } from 'mongodb';
import { DeliveryController } from '../../../src/controllers/delivery.controller';
import { RequestExpress } from '../../../src/interfaces/IRequestExpress';

let mockUserId = new ObjectId().toHexString();
let mockOrderId = new ObjectId().toHexString();

describe('DeliveryController', () => {
  let mockRequest: Partial<RequestExpress>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let deliveryController: DeliveryController;
  let mockDeliveryService: IDeliveryService;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    mockDeliveryService = new MockDeliveryService();
    deliveryController = new DeliveryController(mockDeliveryService);
  });

  describe('createDelivery', () => {
    it('should create a delivery and return the result', async () => {
      const mockRequestBody = [{ orderId: mockOrderId }];
      mockRequest.body = mockRequestBody;
      mockRequest.user = { id: mockUserId };

      await deliveryController.createDelivery(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as any,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Deliveries created',
        data: {
          orderId: mockOrderId,
          userId: mockUserId,
          status: 'pending',
          startingDeliveryDate: null,
          resolutionDeliveryDate: null,
          _id: '64f78b1f48d44a17cbb89bbb',
          createdAt: '2023-09-05T20:10:07.602Z',
          updatedAt: '2023-09-05T20:10:07.602Z',
        },
        status: 201,
      });
    });

    it('if the input is invalid throw error', async () => {
      mockRequest.body = {};

      const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'createDelivery');

      await deliveryController.createDelivery(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as any,
      );

      expect(newDeliveryMockService).not.toHaveBeenCalled();

      expect(mockResponse.status).not.toHaveBeenCalledWith();

      expect(mockResponse.json).not.toHaveBeenCalledWith();
    });
  });

  describe('getDeliveries', () => {
    it('should return all deliveries', async () => {
      const mockRequestQuery = {};
      mockRequest.query = mockRequestQuery;

      const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'getDeliveries');

      await deliveryController.getDeliveries(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as any,
      );

      expect(newDeliveryMockService).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('if the input is invalid throw error', async () => {
      mockRequest.query = {
        status: 'invalid',
      };

      const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'getDeliveries');

      await deliveryController.getDeliveries(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as any,
      );

      expect(newDeliveryMockService).not.toHaveBeenCalled();

      expect(mockResponse.status).not.toHaveBeenCalledWith();

      expect(mockResponse.json).not.toHaveBeenCalledWith();
    });
  });

  it('should return a delivery', async () => {
    const mockRequestQuery = {
      userId: '64f78b1f48d44a17cbb89bbb',
    };
    mockRequest.query = mockRequestQuery;

    const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'getDeliveries');

    await deliveryController.getDeliveries(
      mockRequest as Request,
      mockResponse as Response,
      mockNext as any,
    );

    expect(newDeliveryMockService).toHaveBeenCalledWith(mockRequestQuery);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('if the input is invalid throw error', async () => {
    mockRequest.query = {
      userId: 'invalid',
    };

    const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'getDeliveries');

    await deliveryController.getDeliveries(
      mockRequest as Request,
      mockResponse as Response,
      mockNext as any,
    );

    expect(newDeliveryMockService).not.toHaveBeenCalled();

    expect(mockResponse.status).not.toHaveBeenCalledWith();

    expect(mockResponse.json).not.toHaveBeenCalledWith();
  });

  describe('getDelivery', () => {
    it('should return a delivery', async () => {
      const mockRequestParams = {
        id: '64f89598dc08c4f6086604b1',
      };
      mockRequest.params = mockRequestParams;

      const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'getDelivery');

      await deliveryController.getDelivery(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as any,
      );

      expect(newDeliveryMockService).toHaveBeenCalledWith(mockRequestParams.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('if the input is invalid throw error', async () => {
      mockRequest.params = {
        id: 'invalid',
      };

      const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'getDelivery');

      await deliveryController.getDelivery(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as any,
      );

      expect(newDeliveryMockService).not.toHaveBeenCalled();

      expect(mockResponse.status).not.toHaveBeenCalledWith();

      expect(mockResponse.json).not.toHaveBeenCalledWith();
    });
  });

  describe('updateDelivery', () => {
    it('should update a delivery', async () => {
      const mockRequestParams = {
        id: '64f89598dc08c4f6086604b1',
      };

      mockRequest.params = mockRequestParams;

      const mockRequestBody = {
        status: 'delivered',
      };
      mockRequest.body = mockRequestBody;

      const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'updateDelivery');

      await deliveryController.updateDelivery(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as any,
      );

      expect(newDeliveryMockService).toHaveBeenCalledWith(mockRequestParams.id, {
        status: mockRequestBody.status,
      });

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('if the input is invalid throw error', async () => {
      mockRequest.params = {
        id: 'invalid',
      };

      const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'updateDelivery');

      await deliveryController.updateDelivery(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as any,
      );

      expect(newDeliveryMockService).not.toHaveBeenCalled();

      expect(mockResponse.status).not.toHaveBeenCalledWith();

      expect(mockResponse.json).not.toHaveBeenCalledWith();
    });
  });

  describe('deleteDelivery', () => {
    it('should delete a delivery', async () => {
      const mockRequestParams = {
        id: '64f89598dc08c4f6086604b1',
      };
      mockRequest.params = mockRequestParams;

      const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'deleteDelivery');

      await deliveryController.deleteDelivery(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as any,
      );

      expect(newDeliveryMockService).toHaveBeenCalledWith(mockRequestParams.id);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });

    it('if the input is invalid throw error', async () => {
      mockRequest.params = {
        id: 'invalid',
      };

      const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'deleteDelivery');

      await deliveryController.deleteDelivery(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as any,
      );

      expect(newDeliveryMockService).not.toHaveBeenCalled();

      expect(mockResponse.status).not.toHaveBeenCalledWith();

      expect(mockResponse.json).not.toHaveBeenCalledWith();
    });
  });
});

// Mock de IDeliveryService para usar en las pruebas
class MockDeliveryService implements IDeliveryService {
  getDelivery(id: string): Promise<IDelivery> {
    const delivery: Promise<IDelivery> = new Promise((resolve, reject) => {
      resolve({
        _id: '64f89598dc08c4f6086604b1',
        orderId: '64edf8e120f235e6a7357212',
        userId: '64f65996eca69a74e40cc077',
        status: 'pending',
        startingDeliveryDate: null,
        resolutionDeliveryDate: null,
        createdAt: '2023-09-06T15:07:04.527Z',
        updatedAt: '2023-09-06T15:07:04.527Z',
      });
    });

    return delivery;
  }
  getDeliveries(filters?: BaseFilters | undefined): Promise<PaginationData<IDelivery>> {
    const deliveries: Promise<PaginationData<IDelivery>> = new Promise((resolve, reject) => {
      resolve({
        page: 1,
        totalPages: 1,
        data: [
          {
            _id: '64f792433c82f3350d9e164d',
            orderId: '64edf8e120f235e6a7357211',
            userId: '64f65996eca69a74e40cc077',
            status: 'pending',
          },
        ],
        totalItems: 1,
      });
    });

    return deliveries;
  }
  createDelivery(item: IDeliveryDTO): Promise<IDelivery | IDelivery[]> {
    const delivery: Promise<IDelivery> = new Promise((resolve, reject) => {
      resolve({
        orderId: mockOrderId,
        userId: mockUserId,
        status: 'pending',
        startingDeliveryDate: null,
        resolutionDeliveryDate: null,
        _id: '64f78b1f48d44a17cbb89bbb',
        createdAt: '2023-09-05T20:10:07.602Z',
        updatedAt: '2023-09-05T20:10:07.602Z',
      });
    });

    return delivery;
  }
  updateDelivery(id: string, item: IDelivery): Promise<IDelivery> {
    const delivery: Promise<IDelivery> = new Promise((resolve, reject) => {
      resolve({
        _id: '64f89598dc08c4f6086604b1',
        orderId: '64edf8e120f235e6a7357ca5',
        userId: '64f65996eca69a74e40cc077',
        status: 'delivered',
        startingDeliveryDate: '2023-05-26T11:33:01.000Z',
        resolutionDeliveryDate: '2024-01-16T22:12:34.000Z',
        createdAt: '2023-09-06T15:07:04.527Z',
        updatedAt: '2023-09-06T15:15:45.743Z',
        startingLocation: {
          lat: -6.1134,
          lng: 126.3363,
        },
        destinationLocation: {
          lat: 19.6818,
          lng: 43.2891,
        },
      });
    });

    return delivery;
  }
  deleteDelivery(id: string): Promise<void> {
    return Promise.resolve();
  }
}
