"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliverySchema = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
exports.deliverySchema = new mongoose_1.Schema({
    destinationLocation: {
        type: Object,
    },
    orderId: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    userId: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
    startingLocation: {
        type: Object,
    },
    startingDeliveryDate: { type: Date, default: null },
    resolutionDeliveryDate: { type: Date, default: null },
}, { timestamps: true, strict: 'throw' });
