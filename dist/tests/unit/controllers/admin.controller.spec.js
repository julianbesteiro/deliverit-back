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
const mongodb_1 = require("mongodb");
const admin_service_1 = __importDefault(require("@/services/admin.service"));
//utils
const ordersCheck = (orders) => {
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
    let mockRequest;
    let mockResponse;
    let mockNext;
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
        it('should create an order', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = {
                address: 'casa 1312, CABA',
                coords: { lat: -34.603722, lng: -58.381592 },
                packagesQuantity: 3,
                weight: 2,
                recipient: 'Juan Perez',
            };
            yield expect(admin_controller_1.AdminController.newOrder(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Order created',
                data: mockRequest.body,
                status: 201,
            });
            expect(admin_service_1.default.newOrder).toHaveBeenCalledWith(mockRequest.body);
            expect.assertions(4);
        }));
        it('should throw an error if the request body is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.body = {
                address: 231,
                coords: 123123,
                packagesQuantity: 'test',
                weight: 'test',
                recipient: 1231,
            };
            yield expect(admin_controller_1.AdminController.newOrder(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(admin_service_1.default.newOrder).not.toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Request body types are invalid',
                data: mockRequest.body,
                status: 400,
            });
            let responseJsonDataNewOrder;
            if (mockResponse.json) {
                const jsonMockCalls = mockResponse.json.mock.calls;
                [responseJsonDataNewOrder] = jsonMockCalls[0];
            }
            expect(responseJsonDataNewOrder.data).toEqual({
                address: expect.any(String),
                coords: expect.any(Number),
                packagesQuantity: expect.any(Object),
                weight: expect.any(Number),
                recipient: expect.any(String),
            });
            expect(responseJsonDataNewOrder.data.packagesQuantity).toEqual(expect.objectContaining({ lat: expect.any(Number), lng: expect.any(Number) }));
            expect(Object.keys(responseJsonDataNewOrder.data).length).toEqual(5);
            expect(typeof responseJsonDataNewOrder.data).toEqual('object');
            expect.assertions(8);
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
                yield expect(admin_controller_1.AdminController.newOrder(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                expect(admin_service_1.default.newOrder).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: expectedMessage,
                    data: mockRequest.body,
                    status: expectedStatus,
                });
                expect.assertions(3);
            }));
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
        it('should get analytics based on a specific date', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { date: Date };
            const mockDataByDate = {
                availableWorkers: 4,
                activeWorkers: 2,
                availableOrders: 6,
                deliveredOrders: 5,
            };
            yield expect(admin_controller_1.AdminController.dataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(admin_service_1.default.dataByDate).toHaveBeenCalledWith(mockRequest.params.date);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Data found',
                data: mockDataByDate,
                status: 200,
            });
            let responseJsonDataByDate;
            if (mockResponse.json) {
                const jsonMockCalls = mockResponse.json.mock.calls;
                [responseJsonDataByDate] = jsonMockCalls[0];
            }
            expect(responseJsonDataByDate.data).toEqual({
                availableWorkers: expect.any(Number),
                activeWorkers: expect.any(Number),
                availableOrders: expect.any(Number),
                deliveredOrders: expect.any(Number),
            });
            expect(responseJsonDataByDate.data.activeWorkers).toBeLessThanOrEqual(responseJsonDataByDate.data.availableWorkers);
            expect(responseJsonDataByDate.data.deliveredOrders).toBeLessThanOrEqual(responseJsonDataByDate.data.availableOrders);
            expect(Object.keys(responseJsonDataByDate.data).length).toEqual(4);
            expect(typeof responseJsonDataByDate.data).toEqual('object');
            expect.assertions(9);
        }));
        it('should throw an error if the date is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRequest.params = { date: 34234 };
            yield expect(admin_controller_1.AdminController.dataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(admin_service_1.default.dataByDate).not.toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Invalid Date',
                data: mockRequest.params.date,
                status: 400,
            });
            expect.assertions(4);
        }));
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
            it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { date: date };
                yield expect(admin_controller_1.AdminController.dataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                expect(admin_service_1.default.dataByDate).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: expectedMessage,
                    data: mockRequest.params.date,
                    status: expectedStatus,
                });
                expect.assertions(4);
            }));
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
            it('should get worker data based on a specific date', () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { date: new Date() };
                const mockWorkerData = [
                    { workerId: 12312, status: 'active', percentage: 100 },
                    { workerId: 12313, status: 'active', percentage: 91 },
                    { workerId: 12314, status: 'inactive', percentage: 0 },
                ];
                yield admin_controller_1.AdminController.workerDataByDate(mockRequest, mockResponse, mockNext);
                expect(mockResponse.status).toHaveBeenCalledWith(200);
                expect(admin_service_1.default.workerDataByDate).toHaveBeenCalledWith(mockRequest.params);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: 'Worker data found',
                    data: mockWorkerData,
                    status: 200,
                });
                let responseJsonDataWorkerByDate;
                if (mockResponse.json) {
                    const jsonMockCalls = mockResponse.json.mock.calls;
                    [responseJsonDataWorkerByDate] = jsonMockCalls[0];
                }
                expect(Array.isArray(responseJsonDataWorkerByDate.data)).toEqual(true);
                if (responseJsonDataWorkerByDate.length > 0) {
                    responseJsonDataWorkerByDate.forEach((worker) => {
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
                const workerIdsArray = Object.values(responseJsonDataWorkerByDate.map((worker) => worker.workerId));
                const uniqueWorkerIdsArray = [...new Set(workerIdsArray)];
                expect(workerIdsArray).toEqual(uniqueWorkerIdsArray);
            }));
            it('should throw an error if the params are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = {
                    date: 'bad data',
                };
                yield expect(admin_controller_1.AdminController.workerDataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(admin_service_1.default.workerDataByDate).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: 'Date in params is invalid',
                    data: mockRequest.params,
                    status: 400,
                });
                expect.assertions(4);
            }));
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
                it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                    mockRequest.params = params;
                    yield expect(admin_controller_1.AdminController.workerDataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                    expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                    expect(admin_service_1.default.workerDataByDate).not.toHaveBeenCalled();
                    expect(mockResponse.json).toHaveBeenCalledWith({
                        message: expectedMessage,
                        data: mockRequest.params,
                        status: expectedStatus,
                    });
                    expect.assertions(3);
                }));
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
            it('should update a worker status', () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { id: new mongodb_1.ObjectId() };
                yield admin_controller_1.AdminController.workerStatus(mockRequest, mockResponse, mockNext);
                expect(mockResponse.status).toHaveBeenCalledWith(200);
                const mockWorkerStatus = 'active' || 'inactive';
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: 'Worker status updated',
                    data: { id: mockRequest.params, mockWorkerStatus },
                    status: 200,
                });
            }));
            it('should throw an error if the id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { id: 'invalid id' };
                yield expect(admin_controller_1.AdminController.workerStatus(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(admin_service_1.default.workerStatus).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: 'Invalid id',
                    data: mockRequest.params.id,
                    status: 400,
                });
                expect.assertions(4);
            }));
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
                it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                    mockRequest.params = params;
                    yield expect(admin_controller_1.AdminController.workerStatus(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                    expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                    expect(admin_controller_1.AdminController.workerStatus).not.toHaveBeenCalled();
                    expect(mockResponse.json).toHaveBeenCalledWith({
                        message: expectedMessage,
                        data: mockRequest.params,
                        status: expectedStatus,
                    });
                    expect.assertions(4);
                }));
            });
            it('should throw an error if the userId is an invalid ObjectId of mongodb', () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = {
                    userId: 'invalid id',
                };
                yield expect(admin_controller_1.AdminController.workerStatus(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(admin_controller_1.AdminController.workerStatus).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: 'Invalid ObjectId',
                    id: mockRequest.params,
                    status: 400,
                });
                expect.assertions(4);
            }));
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
            it('should delete an order', () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { id: new mongodb_1.ObjectId() };
                yield admin_controller_1.AdminController.orderToRemove(mockRequest, mockResponse, mockNext);
                expect(mockResponse.status).toHaveBeenCalledWith(200);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: 'Order deleted',
                    data: Object.assign({}, mockRequest.params),
                    status: 200,
                });
            }));
            it('should throw an error if the id is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { id: 'invalid id' };
                yield expect(admin_controller_1.AdminController.orderToRemove(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(admin_controller_1.AdminController.orderToRemove).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: 'Invalid ObjectId',
                    data: mockRequest.params.id,
                    status: 400,
                });
                expect.assertions(4);
            }));
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
            it('should get data by worker id', () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { id: new mongodb_1.ObjectId() };
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
                yield admin_controller_1.AdminController.workerDataById(mockRequest, mockResponse, mockNext);
                expect(mockResponse.status).toHaveBeenCalledWith(200);
                expect(admin_controller_1.AdminController.workerDataByDate).toHaveBeenCalledWith(Object.assign({}, mockRequest.params));
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: 'Workers data found',
                    data: mockWorkerDataById,
                    status: 200,
                });
            }));
            it('should throw an error if the date is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { id: 'invalid id' };
                yield expect(admin_controller_1.AdminController.workerDataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(admin_controller_1.AdminController.workerDataByDate).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: 'Invalid id',
                    data: mockRequest.params.id,
                    status: 400,
                });
                expect.assertions(4);
                let responseJsonDataWorkerById;
                if (mockResponse.json) {
                    const jsonMockCalls = mockResponse.json.mock.calls;
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
            }));
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
                it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                    mockRequest.params = { id: id };
                    yield expect(admin_controller_1.AdminController.workerDataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                    expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                    expect(admin_controller_1.AdminController.workerDataByDate).not.toHaveBeenCalled();
                    expect(mockResponse.json).toHaveBeenCalledWith({
                        message: expectedMessage,
                        date: mockRequest.params.id,
                        status: expectedStatus,
                    });
                    expect.assertions(4);
                }));
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
            it('should get order data based on a specific date', () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = { date: new Date() };
                const mockOrderData = [
                    { orderId: 2112, address: 'casa 1312, CABA' },
                    { orderId: 2113, address: 'casa 1313, CABA' },
                    { orderId: 2114, address: 'casa 1314, CABA' },
                ];
                yield admin_controller_1.AdminController.orderDataByDate(mockRequest, mockResponse, mockNext);
                expect(mockResponse.status).toHaveBeenCalledWith(200);
                expect(admin_service_1.default.orderDataByDate).toHaveBeenCalledWith(mockRequest.query);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: 'Order data found',
                    data: mockOrderData,
                    status: 200,
                });
                expect.assertions(3);
                let responseJsonDatabyDate;
                if (mockResponse.json) {
                    const jsonMockCalls = mockResponse.json.mock.calls;
                    [responseJsonDatabyDate] = jsonMockCalls[0];
                }
                ordersCheck(responseJsonDatabyDate.data);
            }));
            it('should throw an error if the query params are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
                mockRequest.params = {
                    date: 'bad data',
                };
                yield expect(admin_controller_1.AdminController.orderDataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(admin_service_1.default.orderDataByDate).not.toHaveBeenCalled();
                expect(mockResponse.json).toHaveBeenCalledWith({
                    message: 'Date in params is invalid',
                    data: mockRequest.params,
                    status: 400,
                });
            }));
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
                it(description, () => __awaiter(void 0, void 0, void 0, function* () {
                    mockRequest.params = params;
                    yield expect(admin_controller_1.AdminController.orderDataByDate(mockRequest, mockResponse, mockNext)).resolves.toBeUndefined();
                    expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
                    expect(admin_service_1.default.orderDataByDate).not.toHaveBeenCalled();
                    expect(mockResponse.json).toHaveBeenCalledWith({
                        message: expectedMessage,
                        data: mockRequest.params,
                        status: expectedStatus,
                    });
                    expect.assertions(3);
                }));
            });
        });
    });
});
