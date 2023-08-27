"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
const deliverySchema = new mongoose_1.Schema({
    status: {
        type: String,
        default: 'pending',
    },
    packageId: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    workerId: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    startingLocation: {
        type: Object,
    },
    destinationLocation: {
        type: Object,
        required: true,
    },
    startingDate: { type: Date, default: null },
    resolutionDate: { type: Date, default: null },
});
exports.default = deliverySchema;
