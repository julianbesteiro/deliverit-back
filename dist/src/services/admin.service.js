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
const admin_repository_1 = __importDefault(require("../repository/admin.repository"));
const mongoose_1 = __importDefault(require("mongoose"));
class AdminService {
    static workerDataByDate(day, month, year, nextDay) {
        return __awaiter(this, void 0, void 0, function* () {
            const availableWorkers = (yield admin_repository_1.default.availableWorkers(nextDay)).map((worker) => {
                return { id: worker._id, name: worker.name, urlImage: worker.urlImage };
            });
            const deliveriesByDate = yield admin_repository_1.default.deliveriesByDate(day, month, year);
            const valueCounts = {};
            const valueCounts2 = {};
            deliveriesByDate.forEach((value) => {
                if (valueCounts[value.userId]) {
                    valueCounts[value.userId]++;
                }
                else {
                    valueCounts[value.userId] = 1;
                }
            });
            deliveriesByDate.forEach((value) => {
                if (value.status == 'delivered' && valueCounts2[value.userId]) {
                    valueCounts2[value.userId]++;
                }
                else if (value.status == 'delivered') {
                    valueCounts2[value.userId] = 1;
                }
            });
            const workerData = availableWorkers.map((worker) => {
                const objectIdToString = worker.id.toString();
                return {
                    workerName: worker.name,
                    workerId: worker.id,
                    workerImage: worker.urlImage,
                    status: valueCounts2[objectIdToString] ? 'active' : 'inactive',
                    percentage: valueCounts[objectIdToString]
                        ? Math.round((valueCounts2[objectIdToString] / valueCounts[objectIdToString]) * 100)
                        : 0,
                };
            });
            return workerData;
        });
    }
    static workerDataById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(id);
            const workerDataById = yield admin_repository_1.default.deliveryDataById(objectId);
            const deliveredOrders = workerDataById.workerOrders
                .filter((delivery) => delivery.status === 'delivered')
                .map((delivery) => {
                var _a;
                return { deliveryId: delivery._id, address: (_a = delivery.orderId) === null || _a === void 0 ? void 0 : _a.address };
            });
            const pendingOrders = workerDataById.workerOrders
                .filter((delivery) => delivery.status !== 'delivered' && delivery.status !== 'cancelled')
                .map((delivery) => {
                var _a;
                return {
                    deliveryId: delivery._id,
                    address: (_a = delivery.orderId) === null || _a === void 0 ? void 0 : _a.address,
                    status: delivery.status,
                };
            });
            const blockUntil = workerDataById.workerData.blockUntil
                ? Number(new Date(workerDataById.workerData.blockUntil))
                : Number(new Date());
            return {
                workerId: workerDataById.workerData.name,
                status: blockUntil - Number(new Date()) > 86400000 ? 'inactive' : 'active',
                urlImage: workerDataById.workerData.urlImage,
                deliveredOrders: deliveredOrders,
                pendingOrders: pendingOrders,
            };
        });
    }
    static orderDataByDate(day, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderDataByDate = yield admin_repository_1.default.availableOrdersByDate(day, month, year);
            const filteredOrderDataByDate = orderDataByDate.map((order) => {
                return {
                    orderId: order._id,
                    address: order.address,
                };
            });
            return filteredOrderDataByDate;
        });
    }
    static dataByDate(day, month, year, nextDay) {
        return __awaiter(this, void 0, void 0, function* () {
            const deliveriesByDate = yield admin_repository_1.default.deliveriesByDate(day, month, year);
            const availableOrders = yield admin_repository_1.default.availableOrdersByDate(day, month, year);
            const availableWorkers = yield admin_repository_1.default.availableWorkers(nextDay);
            const activeWorkers = deliveriesByDate
                .filter((delivery) => delivery.status === 'delivered')
                .map((delivery) => { var _a; return (_a = delivery.userId) === null || _a === void 0 ? void 0 : _a.toString(); });
            const uniqueActiveWorkers = [...new Set(activeWorkers)];
            const deliveredDeliveries = deliveriesByDate
                .filter((delivery) => delivery.status === 'delivered')
                .map((delivery) => { var _a; return (_a = delivery.orderId) === null || _a === void 0 ? void 0 : _a.toString(); });
            //find uniqueActiveWorker on availableWorkers array and get urlImage property
            const activeWorkersImages = uniqueActiveWorkers.map((activeWorker) => {
                const findResult = availableWorkers.find((worker) => worker._id.toString() === activeWorker);
                return { id: findResult === null || findResult === void 0 ? void 0 : findResult._id.toString(), urlImage: findResult === null || findResult === void 0 ? void 0 : findResult.urlImage };
            });
            return {
                deliveredOrders: deliveredDeliveries.reduce((acc, delivery) => {
                    availableOrders
                        .map((order) => {
                        if (delivery)
                            return order._id.toString();
                    })
                        .includes(delivery)
                        ? acc++
                        : acc;
                    return acc;
                }, 0),
                availableOrders: availableOrders.length,
                availableWorkers: availableWorkers.length,
                activeWorkers: { total: uniqueActiveWorkers.length, images: activeWorkersImages },
            };
        });
    }
    static workerStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(id);
            const updateResult = yield admin_repository_1.default.workerStatus(objectId);
            const newStatus = updateResult
                ? Number(updateResult.blockUntil) > 86400000
                    ? 'inactive'
                    : 'active'
                : 'Unknown status';
            return `Worker status updated to ${newStatus}`;
        });
    }
}
exports.default = AdminService;
