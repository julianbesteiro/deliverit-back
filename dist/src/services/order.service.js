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
const repository_1 = require("../repository");
class OrderService {
    static getOrder(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repository_1.OrderRepository.getOrder(id);
        });
    }
    //----------------------------------------------------------------------------------------------
    static getOrders(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield repository_1.OrderRepository.findAll(filters);
            return orders;
        });
    }
    //----------------------------------------------------------------------------------------------
    /*   static async getOrders(filters?: BaseFilters | undefined): Promise<PaginationData<IOrder>> {
        return await OrderRepository.getOrders(filters);
      } */
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
}
exports.OrderService = OrderService;
