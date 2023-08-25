"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schemas_1 = require("../schemas");
const OrderModel = mongoose_1.default.models.Order || mongoose_1.default.model('Order', schemas_1.orderSchema);
exports.default = OrderModel;
