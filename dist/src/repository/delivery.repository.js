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
class DeliveryRepository {
    constructor(deliveryModel) {
        this.deliveryModel = deliveryModel;
    }
    create(delivery) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingDelivery = yield this.deliveryModel.findOne({
                orderId: delivery.orderId,
                status: {
                    $in: ['delivered', 'pending', 'on-course'],
                },
            });
            if (existingDelivery) {
                throw new customErrors_1.BadUserInputError({ message: 'Delivery already exists' });
            }
            const deliveryCreated = yield this.deliveryModel.create(delivery);
            if (!deliveryCreated) {
                throw new customErrors_1.DatabaseConnectionError('Delivery not created');
            }
            return deliveryCreated;
        });
    }
    findAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = (filters === null || filters === void 0 ? void 0 : filters.page) || 1;
            const limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 10;
            const skip = (page - 1) * limit;
            const filter = {};
            if (filters === null || filters === void 0 ? void 0 : filters.status) {
                filter.status = filters.status;
            }
            if (filters === null || filters === void 0 ? void 0 : filters.userId) {
                filter.userId = filters.userId;
            }
            // Agregamos el filtro de fecha para el día actual
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
            const totalItems = yield this.deliveryModel.countDocuments(Object.assign(Object.assign({}, filter), { createdAt: { $gte: startOfDay, $lte: endOfDay } }));
            const totalPages = Math.ceil(totalItems / limit);
            const query = this.deliveryModel
                .find(Object.assign(Object.assign({}, filter), { createdAt: { $gte: startOfDay, $lte: endOfDay } }))
                .skip(skip)
                .limit(limit)
                .select('status _id orderId userId')
                .populate({
                path: 'orderId',
                select: '_id status address coords.lat coords.lng packagesQuantity weight recipient deliveryDate',
                model: 'Order',
                options: {
                    fields: 'order', // Cambia el nombre del campo en el JSON de salida
                },
            });
            const deliveries = yield query.exec();
            return {
                data: deliveries,
                page,
                totalPages,
                totalItems,
            };
        });
    }
    findById(id, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (filters) {
                const delivery = yield this.deliveryModel.findOne(Object.assign({ _id: id }, filters)).populate({
                    path: 'orderId',
                    select: '_id status address coords.lat coords.lng packagesQuantity weight recipient deliveryDate',
                    model: 'Order',
                    options: {
                        fields: 'order',
                    },
                });
                if (!delivery) {
                    throw new customErrors_1.NoContentError('Delivery not found');
                }
                return delivery;
            }
            const delivery = yield this.deliveryModel.findById(id).populate({
                path: 'orderId',
                select: '_id status address coords.lat coords.lng packagesQuantity weight recipient deliveryDate',
                model: 'Order',
                options: {
                    fields: 'order', // Cambia el nombre del campo en el JSON de salida
                },
            });
            if (!delivery) {
                throw new customErrors_1.NoContentError('Delivery not found');
            }
            return delivery;
        });
    }
    update(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Primero, busca el documento por su _id
            const existingDelivery = yield this.deliveryModel.findById(id);
            if (!existingDelivery) {
                throw new customErrors_1.DatabaseConnectionError('Delivery not found'); // Manejar si el documento no se encuentra
            }
            // Actualiza los campos del documento con los datos proporcionados
            Object.assign(existingDelivery, updateData);
            // Guarda los cambios en la base de datos
            const deliveryUpdated = (yield existingDelivery.save()).populate({
                path: 'orderId',
                select: '_id status address coords.lat coords.lng packagesQuantity weight recipient deliveryDate',
                model: 'Order',
                options: {
                    fields: 'order',
                },
            });
            if (!deliveryUpdated) {
                throw new customErrors_1.DatabaseConnectionError('Delivery not updated');
            }
            return deliveryUpdated;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deliveryModel.findByIdAndDelete(id);
        });
    }
}
exports.default = DeliveryRepository;
