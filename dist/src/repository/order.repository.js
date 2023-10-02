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
    static getOrders(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = (filters === null || filters === void 0 ? void 0 : filters.page) || 1;
            const limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 10;
            const skip = (page - 1) * limit;
            const filter = {};
            if (filters === null || filters === void 0 ? void 0 : filters.userId) {
                filter.userId = filters.userId;
            }
            if (filters === null || filters === void 0 ? void 0 : filters.status) {
                filter.status = filters.status;
            }
            let startDate;
            let endDate;
            // Verifica si se especifica una fecha de entrega en el filtro
            if (filters === null || filters === void 0 ? void 0 : filters.deliveryDate) {
                startDate = new Date(filters.deliveryDate);
                endDate = new Date(filters.deliveryDate);
                startDate.setUTCHours(0, 0, 0, 0);
                endDate.setUTCHours(23, 59, 59, 999);
                console.log(startDate, endDate);
            }
            else {
                const today = new Date();
                today.setUTCHours(0, 0, 0, 0);
                startDate = today;
                endDate = new Date(today);
                endDate.setUTCHours(23, 59, 59, 999);
                console.log(startDate, endDate);
            }
            const totalItems = yield Order_1.default.countDocuments(Object.assign(Object.assign({}, filter), { deliveryDate: { $gte: startDate, $lte: endDate } }));
            const totalPages = Math.ceil(totalItems / limit);
            const query = Order_1.default.find(Object.assign(Object.assign({}, filter), { deliveryDate: { $gte: startDate, $lte: endDate } }))
                .skip(skip)
                .limit(limit)
                .select('_id status userId address packagesQuantity weight');
            const orders = yield query.exec();
            return {
                data: orders,
                page,
                totalPages,
                totalItems,
            };
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
            const options = { new: true };
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
            const options = { new: true };
            const patched = yield Order_1.default.findByIdAndUpdate(orderId, updatedFields, options);
            return patched;
        });
    }
    static updateOrderStatus(orders, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const ordersId = orders.map((order) => order.orderId);
            const updateResult = yield Order_1.default.updateMany({ _id: { $in: ordersId } }, { $set: { status: status } });
            if (updateResult.modifiedCount === orders.length) {
                const updatedOrders = yield Order_1.default.find({ _id: { $in: ordersId } });
                return updatedOrders;
            }
            else {
                throw new customErrors_1.EntityNotFoundError('No se pudieron actualizar las órdenes.');
            }
        });
    }
}
exports.OrderRepository = OrderRepository;
