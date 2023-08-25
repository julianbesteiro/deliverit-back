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
    static orderServiceTest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //logica random
                const maxOrders = id + 100;
                const orderRepositoryData = yield repository_1.OrderRepository.orderRepositoryTest(maxOrders);
                console.log('test service');
                return orderRepositoryData;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repository_1.OrderRepository.createOrder(order);
        });
    }
}
exports.OrderService = OrderService;
