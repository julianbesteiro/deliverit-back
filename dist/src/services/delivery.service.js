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
const config_1 = __importDefault(require("../../config"));
const customErrors_1 = require("../errors/customErrors");
class DeliveryService {
    constructor(deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }
    getDelivery(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const delivery = this.deliveryRepository.findById(id);
            return delivery;
        });
    }
    getDeliveries(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const deliveries = this.deliveryRepository.findAll(filters);
            return deliveries;
        });
    }
    createDelivery(deliveryDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orders } = deliveryDTO;
            const deliveriesPending = yield this.getDeliveries({
                userId: deliveryDTO.userId,
                status: 'pending',
            });
            const deliveriesOnCourse = yield this.getDeliveries({
                userId: deliveryDTO.userId,
                status: 'on-course',
            });
            const deliveriesComplete = yield this.getDeliveries({
                userId: deliveryDTO.userId,
                status: 'delivered',
            });
            const data = [
                ...deliveriesPending.data,
                ...deliveriesOnCourse.data,
                ...deliveriesComplete.data,
            ];
            const totalPackagesInDeliveries = data.reduce((acc, delivery) => {
                return acc + delivery.orderId.packagesQuantity;
            }, 0);
            const totalOrders = deliveryDTO.orders.reduce((acc, order) => {
                return acc + order.packagesQuantity;
            }, 0);
            const totalPackages = totalPackagesInDeliveries + totalOrders;
            if (totalPackages > Number(config_1.default.MAX_NUMBER_OF_PACKAGES_PER_DAY)) {
                throw new customErrors_1.BadUserInputError({ message: 'Maximum deliveries exceeded' });
            }
            const createPromises = orders.map((order) => __awaiter(this, void 0, void 0, function* () {
                const deliveryCreated = yield this.deliveryRepository.create({
                    orderId: order.orderId,
                    userId: deliveryDTO.userId,
                });
                return deliveryCreated;
            }));
            const deliveriesCreated = yield Promise.all(createPromises);
            return { deliveries: deliveriesCreated, totalPackages };
        });
    }
    updateDelivery(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            if (update.status === 'delivered') {
                const deliveryUpdated = yield this.deliveryRepository.update(id, Object.assign(Object.assign({}, update), { resolutionDeliveryDate: new Date() }));
                return deliveryUpdated;
            }
            if (update.status === 'on-course') {
                const deliveryUpdated = yield this.deliveryRepository.update(id, Object.assign(Object.assign({}, update), { startingDeliveryDate: new Date() }));
                return deliveryUpdated;
            }
            if (update.status === 'pending') {
                const deliveryUpdated = yield this.deliveryRepository.update(id, Object.assign(Object.assign({}, update), { startingDeliveryDate: null, resolutionDeliveryDate: null }));
                return deliveryUpdated;
            }
            const deliveryUpdated = yield this.deliveryRepository.update(id, update);
            return deliveryUpdated;
        });
    }
    canChangeStatus(userId, deliveryId, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const delivery = yield this.deliveryRepository.findById(deliveryId);
            if (!delivery) {
                throw new customErrors_1.BadUserInputError({ message: 'Delivery not found' });
            }
            if (delivery.status === 'cancelled' || delivery.status === 'delivered') {
                throw new customErrors_1.BadUserInputError({ message: 'Delivery cannot be changed' });
            }
            if (delivery.status === 'on-course' && input.status === 'cancelled') {
                throw new customErrors_1.BadUserInputError({ message: 'Delivery cannot be changed' });
            }
            if (delivery.status === 'pending' && input.status === 'delivered') {
                throw new customErrors_1.BadUserInputError({ message: 'Delivery cannot be changed' });
            }
            if (delivery.status === 'pending' && input.status === 'on-course') {
                const deliveries = yield this.getDeliveries({
                    status: 'on-course',
                    userId: userId,
                });
                if (deliveries.data.length > 0) {
                    throw new customErrors_1.BadUserInputError({ message: 'Are a delivery in course' });
                }
            }
            if (delivery.userId != userId) {
                throw new customErrors_1.UnauthorizedError("You don't have permission to change this delivery");
            }
            return input;
        });
    }
    deleteDelivery(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedDelivery = this.deliveryRepository.delete(id);
            return deletedDelivery;
        });
    }
}
exports.default = DeliveryService;
