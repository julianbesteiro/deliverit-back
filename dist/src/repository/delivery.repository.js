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
class DeliveryRepository {
    constructor(deliveryModel) {
        this.deliveryModel = deliveryModel;
    }
    create(delivery) {
        return __awaiter(this, void 0, void 0, function* () {
            const deliveryCreated = yield this.deliveryModel.create(delivery);
            return deliveryCreated;
        });
    }
    findAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (filters) {
                return yield this.deliveryModel.find(filters);
            }
            const deliveries = yield this.deliveryModel.find();
            return deliveries;
        });
    }
    findById(id, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (filters) {
                return yield this.deliveryModel.findOne(Object.assign({ where: { id } }, filters));
            }
            const delivery = yield this.deliveryModel.findById(id);
            return delivery;
        });
    }
    update(id, delivery) {
        return __awaiter(this, void 0, void 0, function* () {
            // Usa el tipo UpdateResult correcto aquí
            const deliveryUpdated = yield this.deliveryModel.updateOne({ where: { id } }, { delivery });
            if (deliveryUpdated.modifiedCount === 1) {
                // Obtiene y devuelve el documento actualizado
                const updatedDelivery = yield this.deliveryModel.findById(id);
                return updatedDelivery;
            }
            else {
                return null; // Maneja el fallo de la actualización si es necesario
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deliveryModel.deleteOne({ where: { id } });
        });
    }
}
exports.default = DeliveryRepository;
