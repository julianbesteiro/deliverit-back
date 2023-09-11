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
const mongoose_1 = __importDefault(require("mongoose"));
const schemas_1 = require("../schemas");
// Método estático para actualizar el estado y establecer la fecha de inicio o resolución según el nuevo estado
schemas_1.deliverySchema.statics.updateStatusAndSetDates = function (deliveryId, newStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        const delivery = yield this.findById(deliveryId);
        if (delivery) {
            if (delivery.status === 'pending' && newStatus === 'on-course') {
                delivery.status = newStatus;
                delivery.startingDate = new Date();
            }
            else if (delivery.status === 'on-course' &&
                (newStatus === 'delivered' || newStatus === 'cancelled')) {
                delivery.status = newStatus;
                delivery.resolutionDate = new Date();
            }
            yield delivery.save();
        }
    });
};
const DeliveryModel = mongoose_1.default.models.Delivery || mongoose_1.default.model('Delivery', schemas_1.deliverySchema);
exports.default = DeliveryModel;
