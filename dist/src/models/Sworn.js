"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schemas_1 = require("../schemas");
const SwornModel = mongoose_1.default.models.Sworn || mongoose_1.default.model('Sworn', schemas_1.swornSchema);
exports.default = SwornModel;
