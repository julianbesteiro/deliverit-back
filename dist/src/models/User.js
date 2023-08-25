"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schemas_1 = require("../schemas");
const UserModel = mongoose_1.default.models.User || mongoose_1.default.model('User', schemas_1.userSchema);
exports.default = UserModel;
