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
const delivery_service_1 = __importDefault(require("@/services/delivery.service"));
const delivery_repository_1 = __importDefault(require("@/repository/delivery.repository"));
const mongodb_1 = require("mongodb");
jest.mock('@/repository/delivery.repository');
describe('DeliveryService', () => {
    let mockRepository;
    let deliveryService;
    beforeEach(() => {
        mockRepository = new delivery_repository_1.default({});
        deliveryService = new delivery_service_1.default(mockRepository);
    });
    it('createDelivery ====>', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockDelivery = {
            status: 'pending',
            orderId: new mongodb_1.ObjectId(),
            userId: new mongodb_1.ObjectId(),
        };
        mockRepository.create.mockResolvedValue(mockDelivery);
        const result = yield deliveryService.createDelivery(mockDelivery);
        expect(result).toMatchObject(mockDelivery);
        expect(mockRepository.create).toHaveBeenCalledTimes(1);
        expect(mockRepository.create).toHaveBeenCalledWith(mockDelivery);
    }));
    it('getDeliveries ====>', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockDelivery = {
            orderId: new mongodb_1.ObjectId(),
            userId: new mongodb_1.ObjectId(),
        };
        mockRepository.findAll.mockResolvedValue([mockDelivery]);
        const result = yield deliveryService.getDeliveries();
        expect(result).toMatchObject([mockDelivery]);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    }));
    it('getDeliveryById ====>', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockId = new mongodb_1.ObjectId();
        const mockDelivery = {
            orderId: new mongodb_1.ObjectId(),
            userId: new mongodb_1.ObjectId(),
        };
        mockRepository.findById.mockResolvedValue(mockDelivery);
        const result = yield deliveryService.getDelivery(mockId.toHexString());
        expect(result).toMatchObject(mockDelivery);
        expect(mockRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockRepository.findById).toHaveBeenCalledWith(mockId.toHexString());
    }));
    it('updateDelivery ====>', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockId = new mongodb_1.ObjectId();
        const mockDelivery = {
            orderId: new mongodb_1.ObjectId(),
            userId: new mongodb_1.ObjectId(),
        };
        mockRepository.update.mockResolvedValue(mockDelivery);
        const result = yield deliveryService.updateDelivery(mockId.toHexString(), mockDelivery);
        expect(result).toMatchObject(mockDelivery);
        expect(mockRepository.update).toHaveBeenCalledTimes(1);
        expect(mockRepository.update).toHaveBeenCalledWith(mockId.toHexString(), mockDelivery);
    }));
    it('deleteDelivery ====>', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockId = new mongodb_1.ObjectId();
        mockRepository.delete.mockResolvedValue();
        yield deliveryService.deleteDelivery(mockId.toHexString());
        expect(mockRepository.delete).toHaveBeenCalledTimes(1);
        expect(mockRepository.delete).toHaveBeenCalledWith(mockId.toHexString());
    }));
    it('getDeliveriesByUser ====>', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockDelivery = {
            orderId: new mongodb_1.ObjectId(),
            userId: new mongodb_1.ObjectId(),
        };
        const mockFilters = { userId: mockDelivery.userId.toHexString() };
        mockRepository.findAll.mockResolvedValue([mockDelivery]);
        const result = yield deliveryService.getDeliveriesByUser(mockFilters);
        expect(result).toMatchObject([mockDelivery]);
        expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
        expect(mockRepository.findAll).toHaveBeenCalledWith(mockFilters);
    }));
    it('patchDelivery ====>', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockDelivery = {
            orderId: new mongodb_1.ObjectId(),
            userId: new mongodb_1.ObjectId(),
        };
        const mockFilters = { userId: mockDelivery.userId.toHexString() };
        mockRepository.update.mockResolvedValue(mockDelivery);
        const result = yield deliveryService.patchDelivery(mockFilters);
        expect(result).toMatchObject(mockDelivery);
        expect(mockRepository.update).toHaveBeenCalledTimes(1);
        expect(mockRepository.update).toHaveBeenCalledWith(mockFilters, mockDelivery);
    }));
});
