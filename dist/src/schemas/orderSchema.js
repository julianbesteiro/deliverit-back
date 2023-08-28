"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    status: {
        type: String,
        default: 'unassigned',
    },
    address: {
        type: String,
        required: true,
    },
    coords: {
        type: Object,
        required: true,
    },
    packagesQuantity: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    recipient: {
        type: String,
    },
    deliveryDate: { type: Date, default: null },
});
exports.default = orderSchema;
