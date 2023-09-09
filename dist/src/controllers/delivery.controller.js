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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryController = void 0;
const customErrors_1 = require("@/errors/customErrors");
const asyncHandler_1 = require("@/utils/asyncHandler"); // Ajusta la ruta según la estructura de carpetas
const validateObjectId_1 = require("@/utils/validateObjectId");
const validationDelivery_1 = require("@/utils/validationDelivery");
class DeliveryController {
    constructor(deliveryServices) {
        this.deliveryServices = deliveryServices;
        this.createDelivery = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { user } = req;
            const orders = body;
            const ordersValidate = yield (0, validationDelivery_1.validateDeliveryInput)(orders);
            const deliveries = yield this.deliveryServices.createDelivery({
                userId: user.id,
                orders: ordersValidate,
            });
            return res.status(201).json({
                message: 'Deliveries created',
                data: deliveries,
                status: 201,
            });
        }));
        this.getDelivery = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!(0, validateObjectId_1.validateObjectId)(id)) {
                throw new customErrors_1.BadUserInputError({ id: 'Invalid id' });
            }
            const delivery = yield this.deliveryServices.getDelivery(id);
            return res.status(200).json({
                message: 'Delivery found',
                data: delivery,
                status: 200,
            });
        }));
        this.getDeliveries = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { query } = req;
            let filters = query;
            filters = yield (0, validationDelivery_1.validateDeliveryFilters)(filters);
            let deliveries;
            if (Object.keys(filters).length === 0) {
                deliveries = yield this.deliveryServices.getDeliveries();
            }
            else {
                deliveries = yield this.deliveryServices.getDeliveries(filters);
            }
            return res.status(200).json({
                message: 'Deliveries found',
                page: deliveries.page,
                totalPages: deliveries.totalPages,
                data: deliveries.data,
                totalItems: deliveries.totalItems,
                itemsPerPage: deliveries.data.length,
                prevPage: deliveries.page > 1 ? `/deliveries?page=${deliveries.page - 1}` : null,
                nextPage: deliveries.page < deliveries.totalPages
                    ? `/deliveries?page=${deliveries.page + 1}`
                    : null,
                status: 200,
            });
        }));
        this.updateDelivery = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { user } = req;
            if (!(0, validateObjectId_1.validateObjectId)(user.id)) {
                throw new customErrors_1.BadUserInputError({ id: 'Invalid id' });
            }
            const delivery = body;
            const deliveryUpdated = yield this.deliveryServices.updateDelivery(delivery);
            return res.status(200).json({
                message: 'Delivery updated',
                data: deliveryUpdated,
                status: 200,
            });
        }));
        this.deleteDelivery = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!(0, validateObjectId_1.validateObjectId)(id)) {
                throw new customErrors_1.BadUserInputError({ id: 'Invalid id' });
            }
            yield this.deliveryServices.deleteDelivery(id);
            return res.status(204).json({
                message: 'Delivery deleted',
                data: null,
                status: 204,
            });
        }));
        this.patchDelivery = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { body } = req;
            if (!(0, validateObjectId_1.validateObjectId)(id)) {
                throw new customErrors_1.BadUserInputError({ id: 'Invalid id' });
            }
            const delivery = body;
            const deliveryPatched = yield this.deliveryServices.patchDelivery(delivery);
            return res.status(200).json({
                message: 'Delivery patched',
                data: deliveryPatched,
                status: 200,
            });
        }));
        this.getDeliveriesByUser = (0, asyncHandler_1.asyncHandler)(() => __awaiter(this, void 0, void 0, function* () { }));
    }
}
exports.DeliveryController = DeliveryController;
