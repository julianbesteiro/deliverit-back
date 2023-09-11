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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = __importDefault(require("../services/admin.service"));
const asyncHandler_1 = require("../utils/asyncHandler");
const validateOrder_1 = require("../utils/validateOrder");
const validateDate_1 = require("../utils/validateDate");
const customErrors_1 = require("../errors/customErrors");
const validateObjectId_1 = require("../utils/validateObjectId");
const services_1 = require("../services");
class AdminController {
}
exports.AdminController = AdminController;
_a = AdminController;
AdminController.workerDataByDate = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    const { day, month, year, nextDay } = yield (0, validateDate_1.validateDate)(date);
    const workerDataByDate = yield admin_service_1.default.workerDataByDate(day, month, year, nextDay);
    return res.status(200).json({
        message: 'Successful data request',
        data: workerDataByDate,
        status: 200,
    });
}));
AdminController.workerDataById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const objectIdValidation = (0, validateObjectId_1.validateObjectId)(id);
    if (objectIdValidation === false) {
        throw new customErrors_1.ValidationError('Invalid id');
    }
    const workerDataById = yield admin_service_1.default.workerDataById(id);
    return res.status(200).json({
        message: 'Successful data request',
        data: workerDataById,
        status: 200,
    });
}));
AdminController.orderDataByDate = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    const { day, month, year } = yield (0, validateDate_1.validateDate)(date);
    const orderDataByDate = yield admin_service_1.default.orderDataByDate(day, month, year);
    return res.status(200).json({
        message: 'Successful data request',
        data: orderDataByDate,
        status: 200,
    });
}));
AdminController.dataByDate = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    const { day, month, year, nextDay } = yield (0, validateDate_1.validateDate)(date);
    const dataByDate = yield admin_service_1.default.dataByDate(day, month, year, nextDay);
    return res.status(200).json({
        message: 'Successful data request',
        data: dataByDate,
        status: 200,
    });
}));
AdminController.newOrder = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const validatedData = yield (0, validateOrder_1.validateOrderInput)(body);
    const newOrder = yield services_1.OrderService.createOrder(validatedData);
    return res.status(201).json({
        message: 'Order created',
        data: {
            address: newOrder.address,
            coords: newOrder.coords,
            packagesQuantity: newOrder.packagesQuantity,
            weight: newOrder.weight,
            recipient: newOrder.recipient,
            status: newOrder.status,
            deliveryDate: newOrder.deliveryDate,
        },
        status: 201,
    });
}));
AdminController.orderToRemove = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const objectIdValidation = (0, validateObjectId_1.validateObjectId)(id);
    if (objectIdValidation === false) {
        throw new customErrors_1.ValidationError('Invalid id');
    }
    const deletedOrder = yield services_1.OrderService.deleteOrder(id);
    return res.status(201).json({
        message: 'Order request processed',
        data: deletedOrder ? 'Order deleted' : 'Order not found',
        status: 201,
    });
}));
AdminController.workerStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const objectIdValidation = (0, validateObjectId_1.validateObjectId)(id);
    if (objectIdValidation === false) {
        throw new customErrors_1.ValidationError('Invalid id');
    }
    const updateResult = yield admin_service_1.default.workerStatus(id);
    return res.status(201).json({
        message: 'Worker status updated',
        data: updateResult,
        status: 201,
    });
}));
