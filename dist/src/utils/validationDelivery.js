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
exports.validateDeliveryFilters = exports.validateDeliveryInput = void 0;
const validateObjectId_1 = require("./validateObjectId");
const customErrors_1 = require("../errors/customErrors");
function validateDeliveryInput(orders) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = [];
        if (!Array.isArray(orders)) {
            throw new customErrors_1.BadUserInputError({ message: 'The input is input is not an array' });
        }
        if ((0, validateObjectId_1.hasDuplicates)(orders, 'orderId')) {
            errors.push(new customErrors_1.BadUserInputError({ message: 'Duplicate order id' }));
        }
        if (orders.length === 0 || orders.length > 10) {
            errors.push(new customErrors_1.BadUserInputError({
                message: 'The input is not valid, its length is 0 or greater than 10',
            }));
        }
        orders.forEach((order) => {
            if (!(0, validateObjectId_1.validateObjectId)(order.orderId)) {
                errors.push(new customErrors_1.BadUserInputError({ message: `Invalid order id : ${order.orderId}` }));
            }
            if (Object.keys(order).length > 1 || Object.keys(order).length === 0) {
                errors.push(new customErrors_1.BadUserInputError({ message: 'Invalid data' }));
            }
            if (Object.keys(order)[0] !== 'orderId') {
                errors.push(new customErrors_1.BadUserInputError({ message: 'Status cannot be changed' }));
            }
        });
        if (errors.length > 0) {
            throw errors;
        }
        return orders;
    });
}
exports.validateDeliveryInput = validateDeliveryInput;
function validateDeliveryFilters(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        const errors = [];
        if (filters.status &&
            filters.status !== 'pending' &&
            filters.status !== 'delivered' &&
            filters.status !== 'cancelled' &&
            filters.status !== 'on-course') {
            errors.push(new customErrors_1.BadUserInputError({ message: 'Status is not valid' }));
        }
        if (filters.limit) {
            filters.limit = parseInt(filters.limit.toString());
            if (isNaN(filters.limit)) {
                errors.push(new customErrors_1.BadUserInputError({ message: 'Limit must be a number' }));
            }
            if (filters.limit < 0) {
                errors.push(new customErrors_1.BadUserInputError({ message: 'Limit is not valid' }));
            }
        }
        if (filters.page) {
            filters.page = parseInt(filters.page.toString());
            if (filters.page < 0 || typeof filters.page !== 'number' || isNaN(filters.page)) {
                errors.push(new customErrors_1.BadUserInputError({ message: 'Page is not valid' }));
            }
        }
        if (filters.userId) {
            if (!(0, validateObjectId_1.validateObjectId)(filters.userId)) {
                errors.push(new customErrors_1.BadUserInputError({ message: 'User id is not valid' }));
            }
        }
        if (errors.length > 0) {
            throw errors;
        }
        return filters;
    });
}
exports.validateDeliveryFilters = validateDeliveryFilters;
