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
exports.OrderService = void 0;
const customErrors_1 = require("../errors/customErrors");
const repository_1 = require("../repository");
class OrderService {
    static getOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repository_1.OrderRepository.getOrder(id);
        });
    }
    static getOrders(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield repository_1.OrderRepository.findAll(filters);
            return orders;
        });
    }
    static createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repository_1.OrderRepository.createOrder(order);
        });
    }
    static updateOrder(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repository_1.OrderRepository.updateOrder(id, item);
        });
    }
    static deleteOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repository_1.OrderRepository.deleteOrder(id);
        });
    }
    static patchOrder(orderId, updatedFields) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repository_1.OrderRepository.patchOrder(orderId, updatedFields);
        });
    }
    static updateOrderStatus(orders, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repository_1.OrderRepository.updateOrderStatus(orders, status);
        });
    }
    static checkIfOrdersAreValid(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            const ordersPromise = orders.map((orderInput) => __awaiter(this, void 0, void 0, function* () {
                const orderFound = yield repository_1.OrderRepository.getOrder(orderInput.orderId);
                if (!orderFound) {
                    throw new customErrors_1.BadUserInputError({ message: `Order ${orderInput.orderId} not found` });
                }
                return { orderInput, orderFound };
            }));
            const results = yield Promise.all(ordersPromise);
            const filteredOrders = results.filter(({ orderFound }) => orderFound.status === 'unassigned');
            const ordersChecked = filteredOrders.map(({ orderInput }) => orderInput);
            return ordersChecked;
        });
    }
}
exports.OrderService = OrderService;
