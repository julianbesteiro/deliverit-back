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
const customErrors_1 = require("@/errors/customErrors");
const Delivery_1 = __importDefault(require("@/models/Delivery"));
const Order_1 = __importDefault(require("@/models/Order"));
const User_1 = __importDefault(require("@/models/User"));
class AdminRepository {
    static availableOrdersByDate(day, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const availableOrders = yield Order_1.default.find({
                $expr: {
                    $and: [
                        { $eq: [{ $year: '$deliveryDate' }, year] },
                        { $eq: [{ $month: '$deliveryDate' }, month] },
                        { $eq: [{ $dayOfMonth: '$deliveryDate' }, day] },
                    ],
                },
            });
            return availableOrders;
        });
    }
    static availableWorkers(nextDay) {
        return __awaiter(this, void 0, void 0, function* () {
            const availableWorkers = yield User_1.default.find({ createdAt: { $lte: nextDay } });
            return availableWorkers;
        });
    }
    static deliveriesByDate(day, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const deliveriesByDate = yield Delivery_1.default.find({
                $expr: {
                    $and: [
                        { $eq: [{ $year: '$resolutionDeliveryDate' }, year] },
                        { $eq: [{ $month: '$resolutionDeliveryDate' }, month] },
                        { $eq: [{ $dayOfMonth: '$resolutionDeliveryDate' }, day] },
                    ],
                },
            });
            return deliveriesByDate;
        });
    }
    static workerStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const workerData = yield User_1.default.findOne({ _id: id });
            if (!workerData) {
                throw new customErrors_1.ValidationError('Invalid id');
            }
            const newStatus = !workerData.enabled;
            yield User_1.default.updateOne({ _id: id }, { enabled: newStatus });
            const updatedUser = yield User_1.default.findOne({ _id: id });
            return updatedUser;
        });
    }
    static deliveryDataById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const workerData = yield User_1.default.findOne({ _id: id });
            if (!workerData) {
                throw new customErrors_1.ValidationError('Invalid id');
            }
            const workerOrders = yield Delivery_1.default.find({
                userId: id,
            });
            return { workerOrders, workerData };
        });
    }
    static orderDataByDate(date) {
        return __awaiter(this, void 0, void 0, function* () {
            const ordersSearched = yield Order_1.default.find({ deliveryDate: date });
            return ordersSearched;
        });
    }
}
exports.default = AdminRepository;
