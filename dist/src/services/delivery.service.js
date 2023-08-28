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
class DeliveryService {
    constructor(deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }
    static getDelivery() {
        return __awaiter(this, void 0, void 0, function* () {
            return 'getDelivery';
        });
    }
    static getDeliveries() {
        return __awaiter(this, void 0, void 0, function* () {
            return 'getDeliveries';
        });
    }
    static createDelivery() {
        return __awaiter(this, void 0, void 0, function* () {
            return 'createDelivery';
        });
    }
    static updateDelivery() {
        return __awaiter(this, void 0, void 0, function* () {
            return 'updateDelivery';
        });
    }
    static deleteDelivery() {
        return __awaiter(this, void 0, void 0, function* () {
            return 'deleteDelivery';
        });
    }
    static getDeliveriesByUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return 'getDeliveriesByUser';
        });
    }
    static patchDelivery() {
        return __awaiter(this, void 0, void 0, function* () {
            return 'patchDelivery';
        });
    }
}
exports.default = DeliveryService;
