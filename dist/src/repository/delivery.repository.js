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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const customErrors_1 = require("@/errors/customErrors");
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
            const totalItems = yield this.deliveryModel.countDocuments(filter);
            const totalPages = Math.ceil(totalItems / limit);
            const query = this.deliveryModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .select('status _id orderId userId');
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
                const delivery = yield this.deliveryModel.findOne(Object.assign({ _id: id }, filters));
                if (!delivery) {
                    throw new customErrors_1.DatabaseConnectionError('Delivery not found');
                }
                return delivery;
            }
            const delivery = yield this.deliveryModel.findById(id);
            if (!delivery) {
                throw new customErrors_1.DatabaseConnectionError('Delivery not found');
            }
            return delivery;
        });
    }
    update(delivery) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id } = delivery, updateData = __rest(delivery, ["_id"]); // Extraer _id y otros datos a actualizar
            console.log(_id);
            // Primero, busca el documento por su _id
            const existingDelivery = yield this.deliveryModel.findById(_id);
            if (!existingDelivery) {
                throw new customErrors_1.DatabaseConnectionError('Delivery not found'); // Manejar si el documento no se encuentra
            }
            // Actualiza los campos del documento con los datos proporcionados
            Object.assign(existingDelivery, updateData);
            // Guarda los cambios en la base de datos
            const deliveryUpdated = yield existingDelivery.save();
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
