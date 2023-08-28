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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const asyncHandler_1 = require("@/utils/asyncHandler");
class AdminController {
}
exports.AdminController = AdminController;
_a = AdminController;
AdminController.workerDataByDate = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
AdminController.workerDataById = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
AdminController.orderDataByDate = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
AdminController.dataByDate = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
AdminController.newOrder = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
AdminController.orderToRemove = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
AdminController.workerStatus = (0, asyncHandler_1.asyncHandler)(() => __awaiter(void 0, void 0, void 0, function* () { }));
