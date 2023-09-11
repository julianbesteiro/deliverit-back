"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const delivery_controller_1 = require("../../../src/controllers/delivery.controller");
let mockUserId = new mongodb_1.ObjectId().toHexString();
let mockOrderId = new mongodb_1.ObjectId().toHexString();
describe('DeliveryController', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    let deliveryController;
    let mockDeliveryService;
    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
        mockDeliveryService = new MockDeliveryService();
        deliveryController = new delivery_controller_1.DeliveryController(mockDeliveryService);
    });
    describe('createDelivery', () => {
        it('should create a delivery and return the result', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockRequestBody = [{ orderId: mockOrderId }];
            mockRequest.body = mockRequestBody;
            mockRequest.user = { id: mockUserId };
            yield deliveryController.createDelivery(mockRequest, mockResponse, mockNext);
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
        }));
        it('if the input is invalid throw error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = {};
            const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'createDelivery');
            yield deliveryController.createDelivery(mockRequest, mockResponse, mockNext);
            expect(newDeliveryMockService).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith();
            expect(mockResponse.json).not.toHaveBeenCalledWith();
        }));
    });
    describe('getDeliveries', () => {
        it('should return all deliveries', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockRequestQuery = {};
            mockRequest.query = mockRequestQuery;
            const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'getDeliveries');
            yield deliveryController.getDeliveries(mockRequest, mockResponse, mockNext);
            expect(newDeliveryMockService).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        }));
        it('if the input is invalid throw error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.query = {
                status: 'invalid',
            };
            const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'getDeliveries');
            yield deliveryController.getDeliveries(mockRequest, mockResponse, mockNext);
            expect(newDeliveryMockService).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith();
            expect(mockResponse.json).not.toHaveBeenCalledWith();
        }));
    });
    it('should return a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockRequestQuery = {
            userId: '64f78b1f48d44a17cbb89bbb',
        };
        mockRequest.query = mockRequestQuery;
        const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'getDeliveries');
        yield deliveryController.getDeliveries(mockRequest, mockResponse, mockNext);
        expect(newDeliveryMockService).toHaveBeenCalledWith(mockRequestQuery);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
    }));
    it('if the input is invalid throw error', () => __awaiter(void 0, void 0, void 0, function* () {
        mockRequest.query = {
            userId: 'invalid',
        };
        const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'getDeliveries');
        yield deliveryController.getDeliveries(mockRequest, mockResponse, mockNext);
        expect(newDeliveryMockService).not.toHaveBeenCalled();
        expect(mockResponse.status).not.toHaveBeenCalledWith();
        expect(mockResponse.json).not.toHaveBeenCalledWith();
    }));
    describe('getDelivery', () => {
        it('should return a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockRequestParams = {
                id: '64f89598dc08c4f6086604b1',
            };
            mockRequest.params = mockRequestParams;
            const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'getDelivery');
            yield deliveryController.getDelivery(mockRequest, mockResponse, mockNext);
            expect(newDeliveryMockService).toHaveBeenCalledWith(mockRequestParams.id);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        }));
        it('if the input is invalid throw error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = {
                id: 'invalid',
            };
            const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'getDelivery');
            yield deliveryController.getDelivery(mockRequest, mockResponse, mockNext);
            expect(newDeliveryMockService).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith();
            expect(mockResponse.json).not.toHaveBeenCalledWith();
        }));
    });
    describe('updateDelivery', () => {
        it('should update a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockRequestParams = {
                id: '64f89598dc08c4f6086604b1',
            };
            mockRequest.params = mockRequestParams;
            const mockRequestBody = {
                status: 'delivered',
            };
            mockRequest.body = mockRequestBody;
            const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'updateDelivery');
            yield deliveryController.updateDelivery(mockRequest, mockResponse, mockNext);
            expect(newDeliveryMockService).toHaveBeenCalledWith(mockRequestParams.id, {
                status: mockRequestBody.status,
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        }));
        it('if the input is invalid throw error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = {
                id: 'invalid',
            };
            const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'updateDelivery');
            yield deliveryController.updateDelivery(mockRequest, mockResponse, mockNext);
            expect(newDeliveryMockService).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith();
            expect(mockResponse.json).not.toHaveBeenCalledWith();
        }));
    });
    describe('deleteDelivery', () => {
        it('should delete a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockRequestParams = {
                id: '64f89598dc08c4f6086604b1',
            };
            mockRequest.params = mockRequestParams;
            const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'deleteDelivery');
            yield deliveryController.deleteDelivery(mockRequest, mockResponse, mockNext);
            expect(newDeliveryMockService).toHaveBeenCalledWith(mockRequestParams.id);
            expect(mockResponse.status).toHaveBeenCalledWith(204);
        }));
        it('if the input is invalid throw error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = {
                id: 'invalid',
            };
            const newDeliveryMockService = jest.spyOn(mockDeliveryService, 'deleteDelivery');
            yield deliveryController.deleteDelivery(mockRequest, mockResponse, mockNext);
            expect(newDeliveryMockService).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith();
            expect(mockResponse.json).not.toHaveBeenCalledWith();
        }));
    });
});
// Mock de IDeliveryService para usar en las pruebas
class MockDeliveryService {
    getDelivery(id) {
        const delivery = new Promise((resolve, reject) => {
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
    getDeliveries(filters) {
        const deliveries = new Promise((resolve, reject) => {
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
    createDelivery(item) {
        const delivery = new Promise((resolve, reject) => {
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
    updateDelivery(id, item) {
        const delivery = new Promise((resolve, reject) => {
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
    deleteDelivery(id) {
        return Promise.resolve();
    }
}
