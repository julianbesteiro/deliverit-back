"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('@/services/order.service');
describe('OrderController', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    let orderService;
    // beforeAll(() => {
    //   orderService = new OrderService({} as any);
    // });
    // afterAll(() => {
    //   jest.clearAllMocks();
    // });
    //      -----------------------------------------------------
    //      -----------     Tests for GET       ----------------
    //      -----------------------------------------------------
    //   describe('getOrders', () => {
    //     beforeEach(() => {
    //       mockRequest = { body: {}, params: {}  };
    //       mockResponse = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //       };
    //       mockNext = jest.fn();
    //     });
    //     it('should return a status code of 200 for GET request', async () => {
    //       await OrderController.getOrders(mockRequest as Request, mockResponse as Response, mockNext);
    //       expect(mockResponse.status).toHaveBeenCalledWith(200);
    //     });
    //     it('should return a status code of 200 and an array of orders', async () => {
    //       const mockOrders = [
    //         {
    //           _id: '1',
    //           status: 'unassigned' as ValidStatuses,
    //           address: '123 Main St',
    //           coords: { lat: 0, lng: 0 },
    //           packagesQuantity: 1,
    //           weight: 1,
    //           recipient: 'John Doe',
    //           deliveryDate: new Date(),
    //         },
    //         {
    //           _id: '2',
    //           status: 'assigned' as ValidStatuses,
    //           address: '456 Elm St',
    //           coords: { lat: 0, lng: 0 },
    //           packagesQuantity: 2,
    //           weight: 2,
    //           recipient: 'Jane Smith',
    //           deliveryDate: new Date(),
    //         },
    //       ];
    //       jest.spyOn(orderService, 'getOrders').mockResolvedValue(mockOrders);
    //       await OrderController.getOrders(mockRequest as Request, mockResponse as Response, mockNext);
    //       expect(mockResponse.status).toHaveBeenCalledWith(200);
    //       expect(mockResponse.json).toHaveBeenCalledWith(mockOrders);
    //     });
    //     it('should return a status code of 500 and an error message for a server error', async () => {
    //       const errorMessage = 'Internal server error';
    //       jest.spyOn(orderService, 'getOrders').mockRejectedValue(new Error(errorMessage));
    //       await OrderController.getOrders(mockRequest as Request, mockResponse as Response, mockNext);
    //       expect(mockResponse.status).toHaveBeenCalledWith(500);
    //       expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    //     });
    //   });
    //   //      -----------------------------------------------------
    //   //      -----------     Tests for POST       ----------------
    //   //      -----------------------------------------------------
    //   describe('createOrder', () => {
    //     beforeEach(() => {
    //       mockRequest = { body: {}, params: {} };
    //       mockResponse = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //       };
    //       mockNext = jest.fn();
    //     });
    //   it('should return a status code of 201 and the created order for a valid request body', async () => {
    //     const mockOrder = {
    //       status: 'unassigned' as ValidStatuses,
    //       address: '123 Main St',
    //       coords: { lat: 0, lng: 0 },
    //       packagesQuantity: 1,
    //       weight: 1,
    //       recipient: 'John Doe',
    //       deliveryDate: new Date(),
    //     };
    //     jest.spyOn(orderService, 'createOrder').mockResolvedValue(mockOrder);
    //     mockRequest.body = mockOrder;
    //     await OrderController.createOrder(mockRequest as Request, mockResponse as Response, mockNext);
    //     expect(mockResponse.status).toHaveBeenCalledWith(201);
    //     expect(mockResponse.json).toHaveBeenCalledWith(mockOrder);
    //   });
    //   it('should return a status code of 400 for an invalid request body', async () => {
    //     jest.spyOn(orderService, 'createOrder').mockRejectedValue(new Error('Invalid request body'));
    //     mockRequest.body = {};
    //     await OrderController.createOrder(mockRequest as Request, mockResponse as Response, mockNext);
    //     expect(mockResponse.status).toHaveBeenCalledWith(400);
    //     expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid request body' });
    //   });
    //   it('should return a status code of 500 and an error message for a server error', async () => {
    //     const errorMessage = 'Internal server error';
    //     jest.spyOn(orderService, 'createOrder').mockRejectedValue(new Error(errorMessage));
    //     mockRequest.body = {
    //       status: 'unassigned' as ValidStatuses,
    //       address: '123 Main St',
    //       coords: { lat: 0, lng: 0 },
    //       packagesQuantity: 1,
    //       weight: 1,
    //       recipient: 'John Doe',
    //       deliveryDate: new Date(),
    //     };
    //     await OrderController.createOrder(mockRequest as Request, mockResponse as Response, mockNext);
    //     expect(mockResponse.status).toHaveBeenCalledWith(500);
    //     expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    //   });
    //   it('should return a status code of 400 and an error message for missing required fields', async () => {
    //     const errorMessage = 'Missing required fields';
    //     jest.spyOn(orderService, 'createOrder').mockRejectedValue(new Error(errorMessage));
    //     mockRequest.body = {
    //       status: 'unassigned' as ValidStatuses,
    //       coords: { lat: 0, lng: 0 },
    //       packagesQuantity: 1,
    //       weight: 1,
    //       recipient: 'John Doe',
    //       deliveryDate: new Date(),
    //     };
    //     await OrderController.createOrder(mockRequest as Request, mockResponse as Response, mockNext);
    //     expect(mockResponse.status).toHaveBeenCalledWith(400);
    //     expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    //   });
    //   });
    //   //      -----------------------------------------------------
    //   //      -----------     Tests for PUT      ----------------
    //   //      -----------------------------------------------------
    //   describe('updateOrder', () => {
    //     beforeEach(() => {
    //       mockRequest = { body: {}, params: {}, query: {} };
    //       mockResponse = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //       };
    //       mockNext = jest.fn();
    //     });
    //   it('should return a status code of 200 and the updated order for a valid request body', async () => {
    //     const mockOrder = {
    //       _id: '123',
    //       status: 'unassigned' as ValidStatuses,
    //       address: '123 Main St',
    //       coords: { lat: 0, lng: 0 },
    //       packagesQuantity: 1,
    //       weight: 1,
    //       recipient: 'John Doe',
    //       deliveryDate: new Date(),
    //     };
    //     jest.spyOn(orderService, 'updateOrder').mockResolvedValue(mockOrder);
    //     await OrderController.updateOrder(mockRequest as Request, mockResponse as Response, mockNext);
    //     expect(mockResponse.status).toHaveBeenCalledWith(200);
    //     expect(mockResponse.json).toHaveBeenCalledWith(mockOrder);
    //   });
    //   it('should return a status code of 400 and an error message for missing required fields', async () => {
    //     const errorMessage = 'Missing required fields';
    //     jest.spyOn(orderService, 'updateOrder').mockRejectedValue(new Error(errorMessage));
    //     mockRequest.body = {
    //       status: 'unassigned' as ValidStatuses,
    //       coords: { lat: 0, lng: 0 },
    //       packagesQuantity: 1,
    //       weight: 1,
    //       recipient: 'John Doe',
    //       deliveryDate: new Date(),
    //     };
    //     await OrderController.updateOrder(mockRequest as Request, mockResponse as Response, mockNext);
    //     expect(mockResponse.status).toHaveBeenCalledWith(400);
    //     expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    //   });
    //   it('should return a status code of 500 and an error message for a server error', async () => {
    //     const errorMessage = 'Internal server error';
    //     jest.spyOn(orderService, 'updateOrder').mockRejectedValue(new Error(errorMessage));
    //     mockRequest.body = {
    //       _id: '123',
    //       status: 'unassigned' as ValidStatuses,
    //       address: '123 Main St',
    //       coords: { lat: 0, lng: 0 },
    //       packagesQuantity: 1,
    //       weight: 1,
    //       recipient: 'John Doe',
    //       deliveryDate: new Date(),
    //     };
    //     await OrderController.updateOrder(mockRequest as Request, mockResponse as Response, mockNext);
    //     expect(mockResponse.status).toHaveBeenCalledWith(500);
    //     expect(mockResponse.json).toHaveBeenCalledWith({ message: errorMessage });
    //   });
    //   });
    //   describe('patchOrder', () => {
    //     beforeEach(() => {
    //       mockRequest = { body: {}, params: {} };
    //       mockResponse = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //       };
    //       mockNext = jest.fn();
    //     });
    //   it('should return a status code of 200 and the updated order for a valid request body', async () => {
    //     const orderId = '123';
    //     const updatedOrder = {
    //       packagesQuantity: 2,
    //     };
    //     const mockPatchedOrder = {
    //       _id: orderId,
    //       status: 'unassigned' as ValidStatuses,
    //       address: '123 Main St',
    //       coords: { lat: 0, lng: 0 },
    //       packagesQuantity: 2,
    //       weight: 1,
    //       recipient: 'John Doe',
    //       deliveryDate: new Date(),
    //     };
    //     jest.spyOn(orderService, 'updateOrder').mockResolvedValue(mockPatchedOrder);
    //     mockRequest.params = { id: orderId };
    //     mockRequest.body = updatedOrder;
    //     await OrderController.patchOrder(mockRequest as Request, mockResponse as Response, mockNext);
    //     expect(mockResponse.status).toHaveBeenCalledWith(200);
    //     expect(mockResponse.json).toHaveBeenCalledWith(mockPatchedOrder);
    //   });
    // });
    //   //      -----------------------------------------------------
    //   //      -----------     Tests for DELETE      ----------------
    //   //      -----------------------------------------------------
    //   describe('deleteOrder', () => {
    //     beforeEach(() => {
    //       mockRequest = { body: {}, params: {} };
    //       mockResponse = {
    //         status: jest.fn().mockReturnThis(),
    //         json: jest.fn(),
    //       };
    //       mockNext = jest.fn();
    //     });
    //   it('should return a status code of 204 for a valid request', async () => {
    //     const orderId = '123';
    //     jest.spyOn(orderService, 'deleteOrder').mockResolvedValue(undefined);
    //     mockRequest.params = { id: orderId };
    //     await OrderController.deleteOrder(mockRequest as Request, mockResponse as Response, mockNext);
    //     expect(mockResponse.status).toHaveBeenCalledWith(204);
    //     expect(mockResponse.send).toHaveBeenCalled();
    //   });
    // });
});
