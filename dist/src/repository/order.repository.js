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
exports.OrderRepository = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const customErrors_1 = require("../errors/customErrors");
class OrderRepository {
    static createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOrder = yield Order_1.default.create(order);
            return newOrder;
        });
    }
    static getOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const allOrders = yield Order_1.default.find();
            return allOrders;
        });
    }
    static getOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield Order_1.default.findById(orderId);
            if (!order) {
                const entityName = 'Order';
                throw new customErrors_1.EntityNotFoundError(entityName);
            }
            return order;
        });
    }
    static deleteOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedOrder = yield Order_1.default.findByIdAndDelete(orderId);
            if (!deletedOrder) {
                const entityName = 'Order';
                throw new customErrors_1.EntityNotFoundError(entityName);
            }
            return deletedOrder;
        });
    }
    static updateOrder(orderId, updatedOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { new: true }; // Devolver el documento actualizado
            const updated = yield Order_1.default.findByIdAndUpdate(orderId, updatedOrder, options);
            if (!updated) {
                const entityName = 'Order';
                throw new customErrors_1.EntityNotFoundError(entityName);
            }
            return updated;
        });
    }
    static patchOrder(orderId, updatedFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = { new: true }; // Devolver el documento actualizado
            const patched = yield Order_1.default.findByIdAndUpdate(orderId, updatedFields, options);
            return patched;
        });
    }
}
exports.OrderRepository = OrderRepository;
