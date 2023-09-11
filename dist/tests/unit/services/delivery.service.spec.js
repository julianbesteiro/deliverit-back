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
const delivery_service_1 = __importDefault(require("../../../src/services/delivery.service"));
const mongodb_1 = require("mongodb");
class MockRepository {
    create(item) {
        const delivery = new Promise((resolve) => {
            resolve({
                _id: new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString(),
                orderId: new mongodb_1.ObjectId('64f8d822832a4a979369bf65').toHexString(),
                userId: new mongodb_1.ObjectId('64f65996eca69a74e40cc077').toHexString(),
                status: 'pending',
            });
        });
        return delivery;
    }
    update(id, item) {
        const delivery = new Promise((resolve) => {
            resolve({
                _id: new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString(),
                orderId: new mongodb_1.ObjectId('64f8d822832a4a979369bf65').toHexString(),
                userId: new mongodb_1.ObjectId('64f65996eca69a74e40cc077').toHexString(),
                status: 'delivered',
            });
        });
        return delivery;
    }
    delete(id) {
        const delivery = new Promise((resolve) => {
            resolve(undefined);
        });
        return delivery;
    }
    findAll() {
        const deliveries = new Promise((resolve) => {
            resolve({
                data: [
                    {
                        _id: new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString(),
                        orderId: new mongodb_1.ObjectId('64f8d822832a4a979369bf65').toHexString(),
                        userId: new mongodb_1.ObjectId('64f65996eca69a74e40cc077').toHexString(),
                        status: 'pending',
                    },
                ],
                page: 1,
                totalPages: 1,
                totalItems: 1,
            });
        });
        return deliveries;
    }
    findById(id) {
        const delivery = new Promise((resolve) => {
            resolve({
                _id: new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString(),
                orderId: new mongodb_1.ObjectId('64f8d822832a4a979369bf65').toHexString(),
                userId: new mongodb_1.ObjectId('64f65996eca69a74e40cc077').toHexString(),
                status: 'pending',
            });
        });
        return delivery;
    }
}
describe('DeliveryService', () => {
    let deliveryService;
    let mockRepository;
    beforeEach(() => {
        mockRepository = new MockRepository();
        deliveryService = new delivery_service_1.default(mockRepository);
    });
    afterAll(() => {
        jest.resetAllMocks();
    });
    describe('getDeliveries', () => {
        it('should return an array of deliveries', () => __awaiter(void 0, void 0, void 0, function* () {
            const filters = {
                page: 2,
                status: 'pending',
                userId: new mongodb_1.ObjectId('64f65996eca69a74e40cc077').toHexString(),
            };
            const repositoryMock = jest.spyOn(mockRepository, 'findAll');
            const deliveries = yield deliveryService.getDeliveries(filters);
            expect(repositoryMock).toHaveBeenCalledTimes(1);
            expect(repositoryMock).toHaveBeenCalledWith(filters);
            expect(deliveries).toEqual({
                data: [
                    {
                        _id: new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString(),
                        orderId: new mongodb_1.ObjectId('64f8d822832a4a979369bf65').toHexString(),
                        userId: new mongodb_1.ObjectId('64f65996eca69a74e40cc077').toHexString(),
                        status: 'pending',
                    },
                ],
                page: 1,
                totalPages: 1,
                totalItems: 1,
            });
        }));
        it('should return an array of deliveries without filters', () => __awaiter(void 0, void 0, void 0, function* () {
            const repositoryMock = jest.spyOn(mockRepository, 'findAll');
            const deliveries = yield deliveryService.getDeliveries();
            expect(repositoryMock).toHaveBeenCalledTimes(1);
            expect(deliveries).toEqual({
                data: [
                    {
                        _id: new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString(),
                        orderId: new mongodb_1.ObjectId('64f8d822832a4a979369bf65').toHexString(),
                        userId: new mongodb_1.ObjectId('64f65996eca69a74e40cc077').toHexString(),
                        status: 'pending',
                    },
                ],
                page: 1,
                totalPages: 1,
                totalItems: 1,
            });
        }));
    });
    describe('createDelivery', () => {
        it('should create a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
            const deliveryDTO = {
                userId: new mongodb_1.ObjectId('64f65996eca69a74e40cc077').toHexString(),
                orders: [
                    {
                        orderId: new mongodb_1.ObjectId('64f8d822832a4a979369bf65').toHexString(),
                    },
                    {
                        orderId: new mongodb_1.ObjectId('64f8d822832a4a979369bf66').toHexString(),
                    },
                ],
            };
            const repositoryMock = jest.spyOn(mockRepository, 'create');
            const delivery = yield deliveryService.createDelivery(deliveryDTO);
            expect(repositoryMock).toHaveBeenCalledTimes(2);
            expect(repositoryMock).toHaveBeenCalledWith({
                orderId: new mongodb_1.ObjectId('64f8d822832a4a979369bf65').toHexString(),
                userId: new mongodb_1.ObjectId('64f65996eca69a74e40cc077').toHexString(),
            });
        }));
    });
    describe('getDelivery', () => {
        it('should return a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
            const repositoryMock = jest.spyOn(mockRepository, 'findById');
            const delivery = yield deliveryService.getDelivery(new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString());
            expect(repositoryMock).toHaveBeenCalledTimes(1);
            expect(repositoryMock).toHaveBeenCalledWith(new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString());
            expect(delivery).toEqual({
                _id: new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString(),
                orderId: new mongodb_1.ObjectId('64f8d822832a4a979369bf65').toHexString(),
                userId: new mongodb_1.ObjectId('64f65996eca69a74e40cc077').toHexString(),
                status: 'pending',
            });
        }));
    });
    describe('updateDelivery', () => {
        it('should update a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
            const repositoryMock = jest.spyOn(mockRepository, 'update');
            const delivery = yield deliveryService.updateDelivery(new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString(), {
                status: 'delivered',
            });
            expect(repositoryMock).toHaveBeenCalledTimes(1);
            expect(repositoryMock).toHaveBeenCalledWith(new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString(), {
                status: 'delivered',
            });
            expect(delivery).toEqual({
                _id: new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString(),
                orderId: new mongodb_1.ObjectId('64f8d822832a4a979369bf65').toHexString(),
                userId: new mongodb_1.ObjectId('64f65996eca69a74e40cc077').toHexString(),
                status: 'delivered',
            });
        }));
    });
    describe('deleteDelivery', () => {
        it('should delete a delivery', () => __awaiter(void 0, void 0, void 0, function* () {
            const repositoryMock = jest.spyOn(mockRepository, 'delete');
            const delivery = yield deliveryService.deleteDelivery(new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString());
            expect(repositoryMock).toHaveBeenCalledTimes(1);
            expect(repositoryMock).toHaveBeenCalledWith(new mongodb_1.ObjectId('64f792433c82f3350d9e164d').toHexString());
            expect(delivery).toBeUndefined();
        }));
    });
});
