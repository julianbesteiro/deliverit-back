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
exports.validateOrderInput = void 0;
const customErrors_1 = require("../errors/customErrors");
const validateDate_1 = require("./validateDate");
function validateOrderInput(orderData) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const errors = [];
        if (!orderData || Object.keys(orderData).length === 0) {
            errors.push(new customErrors_1.BadUserInputError({ message: 'Order data is not valid' }));
        }
        if (!orderData.address || typeof orderData.address !== 'string') {
            errors.push(new customErrors_1.BadUserInputError({ message: 'Address is not valid' }));
        }
        if (!((_a = orderData.coords) === null || _a === void 0 ? void 0 : _a.lat) ||
            !((_b = orderData.coords) === null || _b === void 0 ? void 0 : _b.lng) ||
            typeof orderData.coords.lat !== 'number' ||
            typeof orderData.coords.lng !== 'number') {
            errors.push(new customErrors_1.BadUserInputError({ message: 'Destination location is not valid' }));
        }
        if (!orderData.packagesQuantity || typeof orderData.packagesQuantity !== 'number') {
            errors.push(new customErrors_1.BadUserInputError({ message: 'Packages quantity is not valid' }));
        }
        if (!orderData.weight || typeof orderData.weight !== 'number') {
            errors.push(new customErrors_1.BadUserInputError({ message: 'Weight is not valid' }));
        }
        if (!orderData.recipient || typeof orderData.recipient !== 'string') {
            errors.push(new customErrors_1.BadUserInputError({ message: 'Recipient is not valid' }));
        }
        if (!orderData.deliveryDate || typeof orderData.deliveryDate !== 'string') {
            errors.push(new customErrors_1.BadUserInputError({ message: 'Delivery date is not valid' }));
        }
        if (typeof orderData.deliveryDate === 'string') {
            (0, validateDate_1.validateDate)(orderData.deliveryDate);
        }
        if (errors.length > 0) {
            console.log('errors', errors);
            throw errors;
        }
        return orderData;
    });
}
exports.validateOrderInput = validateOrderInput;
