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
const admin_controller_1 = require("@/controllers/admin.controller");
const admin_service_1 = __importDefault(require("@/services/admin.service"));
const services_1 = require("@/services");
const validateDate_1 = require("@/utils/validateDate");
describe('AdminController', () => {
    let mockRequest;
    let mockResponse;
    let mockNext;
    describe('createOrder', () => {
        beforeEach(() => {
            jest.mock('@/services/admin.service');
            jest.mock('@/services/order.service');
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
        it('should create an order', () => __awaiter(void 0, void 0, void 0, function* () {
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
            const newOrderServiceMock = jest.spyOn(services_1.OrderService, 'createOrder');
            newOrderServiceMock.mockResolvedValue(orderOutput);
            yield expect(admin_controller_1.AdminController.newOrder(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(newOrderServiceMock).toHaveBeenCalledWith(orderInput);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Order created',
                data: orderOutput,
                status: 201,
            });
            expect.assertions(4);
        }));
        it('should throw an error if the request body is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const orderInput = {
                address: 231,
                coords: 123123,
                packagesQuantity: 'test',
                weight: 'test',
                recipient: 1231,
                date: 656,
            };
            mockRequest.body = orderInput;
            const newOrderServiceMock = jest.spyOn(services_1.OrderService, 'createOrder');
            yield expect(admin_controller_1.AdminController.newOrder(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(newOrderServiceMock).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith();
            expect(mockResponse.json).not.toHaveBeenCalledWith();
            expect.assertions(4);
        }));
    });
    describe('getDataByDate', () => {
        beforeEach(() => {
            jest.mock('@/services/admin.service');
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
        it('should get analytics based on a specific date', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { date: '2023-09-01' };
            const { day, month, year, nextDay } = yield (0, validateDate_1.validateDate)(mockRequest.params.date);
            const dataByDateOutput = {
                availableWorkers: 2,
                activeWorkers: 0,
                availableOrders: 0,
                deliveredOrders: 0,
            };
            const dataByDateServiceMock = jest.spyOn(admin_service_1.default, 'dataByDate');
            dataByDateServiceMock.mockResolvedValue(dataByDateOutput);
            yield expect(admin_controller_1.AdminController.dataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(dataByDateServiceMock).toHaveBeenCalledWith(day, month, year, nextDay);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        }));
        it('should throw an error if the date is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { date: '!!' };
            const dataByDateServiceMock = jest.spyOn(admin_service_1.default, 'dataByDate');
            yield expect(admin_controller_1.AdminController.dataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(dataByDateServiceMock).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith();
            expect(mockResponse.json).not.toHaveBeenCalledWith();
            expect.assertions(4);
        }));
    });
    describe('getWorkerDataByDate', () => {
        beforeEach(() => {
            jest.mock('@/services/admin.service');
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
        it('should get worker data based on a specific date', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { date: '2023-09-01' };
            const { day, month, year, nextDay } = yield (0, validateDate_1.validateDate)(mockRequest.params.date);
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
            const workerDataByDateServiceMock = jest.spyOn(admin_service_1.default, 'workerDataByDate');
            workerDataByDateServiceMock.mockResolvedValue(mockWorkerData);
            yield admin_controller_1.AdminController.workerDataByDate(mockRequest, mockResponse, mockNext);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(workerDataByDateServiceMock).toHaveBeenCalledWith(day, month, year, nextDay);
        }));
        it('should throw an error if the params are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = {
                date: 'bad data',
            };
            const workerDataByDateServiceMock = jest.spyOn(admin_service_1.default, 'workerDataByDate');
            yield expect(admin_controller_1.AdminController.workerDataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(workerDataByDateServiceMock).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith();
            expect(mockResponse.json).not.toHaveBeenCalledWith();
            expect.assertions(4);
        }));
    });
    describe('editWorkerStatus', () => {
        beforeEach(() => {
            jest.mock('@/services/admin.service');
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
        it('should update a worker status', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: '64f227c58748a162bc8519d0' };
            const editWorkerStatusServiceMock = jest.spyOn(admin_service_1.default, 'workerStatus');
            editWorkerStatusServiceMock.mockResolvedValue('Worker status updated to active');
            yield admin_controller_1.AdminController.workerStatus(mockRequest, mockResponse, mockNext);
            expect(editWorkerStatusServiceMock).toHaveBeenCalledWith(mockRequest.params.id);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Worker status updated',
                data: 'Worker status updated to active',
                status: 201,
            });
        }));
        it('should throw an error if the id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: 'invalid id' };
            const editWorkerStatusServiceMock = jest.spyOn(admin_service_1.default, 'workerStatus');
            yield expect(admin_controller_1.AdminController.workerStatus(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(editWorkerStatusServiceMock).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith();
            expect(mockResponse.json).not.toHaveBeenCalledWith();
            expect.assertions(4);
        }));
    });
    describe('deleteOrder', () => {
        beforeEach(() => {
            jest.mock('@/services/admin.service');
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
        it('should delete an order', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: '64f227c58748a162bc8519d0' };
            const date = new Date('2023-09-01');
            const deleteOrderServiceMock = jest.spyOn(services_1.OrderService, 'deleteOrder');
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
            });
            yield admin_controller_1.AdminController.orderToRemove(mockRequest, mockResponse, mockNext);
            expect(deleteOrderServiceMock).toHaveBeenCalledWith(mockRequest.params.id);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Order request processed',
                data: 'Order deleted',
                status: 201,
            });
        }));
        it('should throw an error if the id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: 'invalid id' };
            const deleteOrderServiceMock = jest.spyOn(services_1.OrderService, 'deleteOrder');
            yield expect(admin_controller_1.AdminController.orderToRemove(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(deleteOrderServiceMock).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith();
            expect(mockResponse.json).not.toHaveBeenCalledWith();
            expect.assertions(4);
        }));
    });
    describe('getWorkerDataById', () => {
        beforeEach(() => {
            jest.mock('@/services/admin.service');
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
        it('should get data by worker id', () => __awaiter(void 0, void 0, void 0, function* () {
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
            const workerDataByIdServiceMock = jest.spyOn(admin_service_1.default, 'workerDataById');
            workerDataByIdServiceMock.mockResolvedValue(mockWorkerDataById);
            yield admin_controller_1.AdminController.workerDataById(mockRequest, mockResponse, mockNext);
            expect(workerDataByIdServiceMock).toHaveBeenCalledWith(mockRequest.params.id);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Successful data request',
                data: mockWorkerDataById,
                status: 200,
            });
        }));
        it('should throw an error if the date is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { id: 'invalid id' };
            const workerDataByIdServiceMock = jest.spyOn(admin_service_1.default, 'workerDataById');
            yield expect(admin_controller_1.AdminController.workerDataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(workerDataByIdServiceMock).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith();
            expect(mockResponse.json).not.toHaveBeenCalledWith();
            expect.assertions(4);
        }));
    });
    describe('getOrderDataByDate', () => {
        beforeEach(() => {
            jest.mock('@/services/admin.service');
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
        it('should get order data based on a specific date', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { date: '2023-09-01' };
            const { day, month, year } = yield (0, validateDate_1.validateDate)(mockRequest.params.date);
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
            const orderDataByDateServiceMock = jest.spyOn(admin_service_1.default, 'orderDataByDate');
            orderDataByDateServiceMock.mockResolvedValue(mockOrderData);
            yield admin_controller_1.AdminController.orderDataByDate(mockRequest, mockResponse, mockNext);
            expect(orderDataByDateServiceMock).toHaveBeenCalledWith(day, month, year);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Successful data request',
                data: mockOrderData,
                status: 200,
            });
            expect.assertions(3);
        }));
        it('should throw an error if the query params are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = {
                date: 'bad data',
            };
            const orderDataByDateServiceMock = jest.spyOn(admin_service_1.default, 'orderDataByDate');
            yield expect(admin_controller_1.AdminController.orderDataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(orderDataByDateServiceMock).not.toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalledWith();
            expect(mockResponse.json).not.toHaveBeenCalledWith();
            expect.assertions(4);
        }));
    });
});
