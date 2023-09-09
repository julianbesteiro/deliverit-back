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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delivery_controller_1 = require("@/controllers/delivery.controller");
const mongodb_1 = require("mongodb");
const delivery_service_1 = __importDefault(require("@/services/delivery.service"));
jest.mock('@/services/delivery.service');
describe('DeliveryController', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    let deliveryService;
    beforeAll(() => {
        deliveryService = new delivery_service_1.default({});
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
        it('should create a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = {
                orderId: new mongodb_1.ObjectId(),
                userId: new mongodb_1.ObjectId(),
            };
            yield expect(delivery_controller_1.DeliveryController.createDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Delivery created',
                data: mockRequest.body,
                status: 201,
            });
            expect(deliveryService.createDelivery).toHaveBeenCalledWith(mockRequest.body);
            expect.assertions(4);
        }));
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
            it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.body = requestBody;
                yield expect(delivery_controller_1.DeliveryController.createDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                expect(deliveryService.createDelivery).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: expectedMessage,
                    data: mockRequest.body,
                    status: expectedStatus,
                });
                expect.assertions(3);
            }));
        });
        it('should throw an error if the orderId an userId are ivalid ObjectId of mongodb', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = {
                orderId: 'invalid id',
                userId: 'invalid id',
            };
            yield expect(delivery_controller_1.DeliveryController.createDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(deliveryService.createDelivery).not.toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid ObjectId',
                data: mockRequest.body,
                status: 400,
            });
            expect.assertions(4);
        }));
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
        it('should get a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: new mongodb_1.ObjectId() };
            yield expect(delivery_controller_1.DeliveryController.getDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(deliveryService.getDelivery).toHaveBeenCalledWith(mockRequest.params.id);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Delivery found',
                data: mockRequest.params.id,
                status: 200,
            });
            expect.assertions(4);
        }));
        it('should throw an error if the id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: 'invalid id' };
            yield expect(delivery_controller_1.DeliveryController.getDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(deliveryService.getDelivery).not.toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid ObjectId',
                data: mockRequest.params.id,
                status: 400,
            });
            expect.assertions(4);
        }));
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
            it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { id: id };
                yield expect(delivery_controller_1.DeliveryController.getDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                expect(deliveryService.getDelivery).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: expectedMessage,
                    data: mockRequest.params.id,
                    status: expectedStatus,
                });
                expect.assertions(4);
            }));
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
        it('should get all deliveries', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.query = {
                limit: 10,
                page: 1,
                status: 'pending',
            };
            const mockDeliveries = [
                {
                    orderId: new mongodb_1.ObjectId(),
                    userId: new mongodb_1.ObjectId(),
                },
                // Agrega más entregas si es necesario
            ];
            yield delivery_controller_1.DeliveryController.getDeliveries(mockRequest, mockResponse, mockNext);
            // Validar el estado y la respuesta aquí si es necesario
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(deliveryService.getDeliveries).toHaveBeenCalledWith(mockRequest.query);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Deliveries found',
                data: mockDeliveries,
                status: 200,
            });
        }));
        it('should throw an error if the query params are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.query = {
                limit: 'bad data',
                page: 'bad data',
                status: 'bad data',
            };
            yield expect(delivery_controller_1.DeliveryController.getDeliveries(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(deliveryService.getDeliveries).not.toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Query params types are invalid',
                data: mockRequest.query,
                status: 400,
            });
            expect.assertions(4);
        }));
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
            it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.query = query;
                yield expect(delivery_controller_1.DeliveryController.getDeliveries(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                expect(deliveryService.getDeliveries).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: expectedMessage,
                    data: mockRequest.query,
                    status: expectedStatus,
                });
                expect.assertions(3);
            }));
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
        it('should update a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: new mongodb_1.ObjectId() };
            mockRequest.body = {
                status: 'delivered',
                orderId: new mongodb_1.ObjectId(),
                userId: new mongodb_1.ObjectId(),
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
            yield delivery_controller_1.DeliveryController.updateDelivery(mockRequest, mockResponse, mockNext);
            // Validar el estado y la respuesta aquí si es necesario
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Delivery updated',
                data: Object.assign(Object.assign({}, mockRequest.params), mockRequest.body),
                status: 200,
            });
        }));
        it('should throw an error if the id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: 'invalid id' };
            yield expect(delivery_controller_1.DeliveryController.updateDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(deliveryService.updateDelivery).not.toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid ObjectId',
                data: mockRequest.params.id,
                status: 400,
            });
            expect.assertions(4);
        }));
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
            it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { id: id };
                yield expect(delivery_controller_1.DeliveryController.updateDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                expect(deliveryService.updateDelivery).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: expectedMessage,
                    data: mockRequest.params.id,
                    status: expectedStatus,
                });
                expect.assertions(4);
            }));
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
            it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.body = requestBody;
                yield expect(delivery_controller_1.DeliveryController.updateDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                expect(deliveryService.updateDelivery).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: expectedMessage,
                    data: mockRequest.body,
                    status: expectedStatus,
                });
                expect.assertions(3);
            }));
        });
        it('should throw an error if the orderId an userId are ivalid ObjectId of mongodb', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = {
                orderId: 'invalid id',
                userId: 'invalid id',
            };
            yield expect(delivery_controller_1.DeliveryController.updateDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(deliveryService.updateDelivery).not.toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid ObjectId',
                data: mockRequest.body,
                status: 400,
            });
            expect.assertions(4);
        }));
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
        it('should delete a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: new mongodb_1.ObjectId() };
            yield delivery_controller_1.DeliveryController.deleteDelivery(mockRequest, mockResponse, mockNext);
            // Validar el estado y la respuesta aquí si es necesario
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Delivery deleted',
                data: Object.assign({}, mockRequest.params),
                status: 200,
            });
        }));
        it('should throw an error if the id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: 'invalid id' };
            yield expect(delivery_controller_1.DeliveryController.deleteDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(deliveryService.deleteDelivery).not.toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid ObjectId',
                data: mockRequest.params.id,
                status: 400,
            });
            expect.assertions(4);
        }));
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
        it('should get all deliveries by user', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { userId: new mongodb_1.ObjectId() };
            mockRequest.query = {
                limit: 10,
                page: 1,
                status: 'pending',
            };
            const mockDeliveries = [
                Object.assign({ _id: new mongodb_1.ObjectId(), orderId: new mongodb_1.ObjectId() }, mockRequest.params),
                // Agrega más entregas si es necesario
            ];
            yield delivery_controller_1.DeliveryController.getDeliveriesByUser(mockRequest, mockResponse, mockNext);
            // Validar el estado y la respuesta aquí si es necesario
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(deliveryService.getDeliveriesByUser).toHaveBeenCalledWith(Object.assign(Object.assign({}, mockRequest.params), mockRequest.query));
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Deliveries found',
                data: mockDeliveries,
                status: 200,
            });
        }));
        it('should throw an error if the userId is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { userId: 'invalid id' };
            yield expect(delivery_controller_1.DeliveryController.getDeliveriesByUser(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(deliveryService.getDeliveriesByUser).not.toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid ObjectId',
                data: mockRequest.params.userId,
                status: 400,
            });
            expect.assertions(4);
        }));
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
            it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { userId: userId };
                yield expect(delivery_controller_1.DeliveryController.getDeliveriesByUser(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                expect(deliveryService.getDeliveriesByUser).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: expectedMessage,
                    data: mockRequest.params.userId,
                    status: expectedStatus,
                });
                expect.assertions(4);
            }));
        });
        it('should throw an error if the query params are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.query = {
                limit: 'bad data',
                page: 'bad data',
                status: 'bad data',
            };
            yield expect(delivery_controller_1.DeliveryController.getDeliveriesByUser(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(deliveryService.getDeliveriesByUser).not.toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Query params types are invalid',
                data: mockRequest.query,
                status: 400,
            });
            expect.assertions(4);
        }));
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
        it('should patch a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: new mongodb_1.ObjectId() };
            mockRequest.body = {
                status: 'delivered',
            };
            yield delivery_controller_1.DeliveryController.patchDelivery(mockRequest, mockResponse, mockNext);
            // Validar el estado y la respuesta aquí si es necesario
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(deliveryService.patchDelivery).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Delivery patched',
                data: Object.assign(Object.assign({}, mockRequest.params), mockRequest.body),
                status: 200,
            });
        }));
        it('should throw an error if the id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: 'invalid id' };
            yield expect(delivery_controller_1.DeliveryController.patchDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(deliveryService.patchDelivery).not.toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid ObjectId',
                data: mockRequest.params.id,
                status: 400,
            });
            expect.assertions(4);
        }));
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
            it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { id: id };
                yield expect(delivery_controller_1.DeliveryController.patchDelivery(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                expect(deliveryService.patchDelivery).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: expectedMessage,
                    data: mockRequest.params.id,
                    status: expectedStatus,
                });
                expect.assertions(4);
            }));
        });
    });
});
