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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const asyncHandler_1 = require("../../src/utils/asyncHandler");
const services_1 = require("../services");
class OrderController {
}
exports.OrderController = OrderController;
_a = OrderController;
OrderController.createOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield services_1.OrderService.createOrder(req.body);
    return res.status(201).json({
        message: 'Order created',
        data: order,
        status: 201,
    });
}));
OrderController.getOrders = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield services_1.OrderService.getOrders();
    return res.status(200).send(orders);
}));
OrderController.getOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const order = yield services_1.OrderService.getOrder(orderId);
    return res.status(200).send(order);
}));
OrderController.deleteOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const deletedOrder = yield services_1.OrderService.deleteOrder(orderId);
    return res.status(200).json({
        message: 'Order deleted',
        data: deletedOrder,
        status: 200,
    });
}));
OrderController.updateOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const updatedOrder = yield services_1.OrderService.updateOrder(orderId, req.body);
    return res.status(200).send(updatedOrder);
}));
OrderController.patchOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const updatedFields = req.body;
    const patchedOrder = yield services_1.OrderService.patchOrder(orderId, updatedFields);
    if (!patchedOrder) {
        return res.status(404).send({ message: 'Orden no encontrada' });
    }
    return res.status(200).send(patchedOrder);
}));
