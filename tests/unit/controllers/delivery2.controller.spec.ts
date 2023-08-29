import { Request, Response } from 'express';
import { BaseFilters, IDelivery, IDeliveryService } from '@/interfaces';
import { DeliveryController } from '@/controllers';
import { ObjectId } from 'mongodb';
import { ValidationError } from '@/errors/customErrors';

let mockUserId = new ObjectId();
let mockOrderId = new ObjectId();

// Mock de IDeliveryService para usar en las pruebas
class MockDeliveryService implements IDeliveryService {
  getDelivery(id: string): Promise<IDelivery | null> {
    throw new Error('Method not implemented.');
  }
  getDeliveries(filters?: BaseFilters | undefined): Promise<IDelivery[]> {
    throw new Error('Method not implemented.');
  }
  createDelivery(item: IDelivery): Promise<IDelivery | null> {
    return Promise.resolve({ orderId: mockOrderId, userId: mockUserId });
  }
  updateDelivery(id: string, item: IDelivery): Promise<IDelivery> {
    throw new Error('Method not implemented.');
  }
  deleteDelivery(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getDeliveriesByUser(filters?: BaseFilters | undefined): Promise<IDelivery[]> {
    throw new Error('Method not implemented.');
  }
  patchDelivery(filters?: BaseFilters | undefined): Promise<IDelivery> {
    throw new Error('Method not implemented.');
  }
}

describe('DeliveryController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let deliveryController: DeliveryController;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    const mockDeliveryService = new MockDeliveryService();
    deliveryController = new DeliveryController(mockDeliveryService);
  });

  describe('createDelivery', () => {
    it('should create a delivery and return the result', async () => {
      const mockRequestBody = {
        orderId: mockOrderId,
        userId: mockUserId,
      };
      mockRequest.body = mockRequestBody;

      await deliveryController.createDelivery(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as any,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Delivery created',
        data: { orderId: mockOrderId, userId: mockUserId },
        status: 201,
      });
    });

    it('should return 400 if request body is empty', async () => {
      mockRequest.body = undefined;

      await deliveryController.createDelivery(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as any,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Request body is empty',
      });
    });
  });

  // Agrega más pruebas para las otras funciones del controlador
});
