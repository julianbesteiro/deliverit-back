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
exports.DeliveryController = void 0;
const asyncHandler_1 = require("@/utils/asyncHandler");
// Utilizando el alias para importar
class DeliveryController {
}
exports.DeliveryController = DeliveryController;
_a = DeliveryController;
DeliveryController.createDelivery = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
DeliveryController.getDelivery = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
DeliveryController.getDeliveries = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
DeliveryController.updateDelivery = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
DeliveryController.deleteDelivery = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
DeliveryController.getDeliveriesByUser = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
DeliveryController.patchDelivery = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
