"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swornSchema = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
exports.swornSchema = new mongoose_1.Schema({
    alcoholicBeverages: {
        type: Boolean,
        required: true,
    },
    psychoactiveMedication: {
        type: Boolean,
        required: true,
    },
    familyProblem: {
        type: Boolean,
        required: true,
    },
    userId: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    swornStatementStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true, strict: 'throw' });
