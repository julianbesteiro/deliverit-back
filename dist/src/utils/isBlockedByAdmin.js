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
exports.isBlockedByAdmin = void 0;
const User_1 = __importDefault(require("../models/User"));
const customErrors_1 = require("../errors/customErrors");
const isBlockedByAdmin = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const workerData = yield User_1.default.findOne({ _id: id });
    if (!workerData) {
        throw new customErrors_1.ValidationError('Invalid id');
    }
    const blockUntil = workerData.blockUntil
        ? Number(new Date(workerData.blockUntil))
        : Number(new Date());
    const differenceBetweenBlockUntilAndCurrentDate = blockUntil - Number(new Date());
    if (differenceBetweenBlockUntilAndCurrentDate > 86400000) {
        throw new customErrors_1.UnauthorizedError("You don't have permission to create deliveries due to an admin block");
    }
    return workerData;
});
exports.isBlockedByAdmin = isBlockedByAdmin;
