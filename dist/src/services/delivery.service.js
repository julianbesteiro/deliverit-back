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
            const createPromises = orders.map((order) => __awaiter(this, void 0, void 0, function* () {
                const deliveryCreated = yield this.deliveryRepository.create({
                    orderId: order.orderId,
                    userId: deliveryDTO.userId,
                });
                return deliveryCreated;
            }));
            const deliveriesCreated = yield Promise.all(createPromises);
            return deliveriesCreated.length === 1 ? deliveriesCreated[0] : deliveriesCreated;
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
