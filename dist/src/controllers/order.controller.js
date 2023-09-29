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
const validateOrder_1 = require("../utils/validateOrder");
const validateObjectId_1 = require("../utils/validateObjectId");
const customErrors_1 = require("../errors/customErrors");
class OrderController {
}
exports.OrderController = OrderController;
_a = OrderController;
OrderController.createOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const validatedData = yield (0, validateOrder_1.validateOrderInput)(body);
    const order = yield services_1.OrderService.createOrder(validatedData);
    return res.status(201).json({
        message: 'Order created',
        data: order,
        status: 201,
    });
}));
OrderController.getOrders = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = req.query;
    let orders;
    if (Object.keys(filters).length === 0) {
        orders = yield services_1.OrderService.getOrders();
    }
    else {
        orders = yield services_1.OrderService.getOrders(filters);
    }
    return res.status(200).send({
        message: 'orders found',
        page: orders.page,
        totalPages: orders.totalPages,
        data: orders.data,
        totalItems: orders.totalItems,
        itemsPerPage: orders.data.length,
        prevPage: orders.page > 1 ? `/orders?page=${orders.page - 1}` : null,
        nextPage: orders.page < orders.totalPages ? `/orders?page=${orders.page + 1}` : null,
        status: 200,
    });
}));
OrderController.getOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const order = yield services_1.OrderService.getOrder(orderId);
    return res.status(200).send(order);
}));
OrderController.deleteOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const objectIdValidation = (0, validateObjectId_1.validateObjectId)(id);
    if (objectIdValidation === false) {
        throw new customErrors_1.ValidationError('Invalid id');
    }
    const deletedOrder = yield services_1.OrderService.deleteOrder(id);
    return res.status(201).json({
        message: 'Order request processed',
        data: deletedOrder ? 'Order deleted' : 'Order not found',
        status: 201,
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
        return res.status(404).send({ message: 'Order not found' });
    }
    return res.status(200).send(patchedOrder);
}));
