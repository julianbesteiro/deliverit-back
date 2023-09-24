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
exports.SwornController = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const validateSworn_1 = require("../utils/validateSworn");
const canSubmitSworn_1 = require("../utils/canSubmitSworn");
class SwornController {
    constructor(swornService) {
        this.swornService = swornService;
        this.createSworn = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { body } = req;
            const { user } = req;
            const canSubmit = yield (0, canSubmitSworn_1.canSubmitSworn)(user.id);
            if (!canSubmit) {
                return res.status(403).json({
                    success: false,
                    message: 'You already submit a sworn statement today',
                });
            }
            const swornValidate = (0, validateSworn_1.validateSwornInput)(body);
            const newSworn = yield this.swornService.createSworn(Object.assign(Object.assign({}, swornValidate), { userId: user.id }));
            const isAvailable = newSworn.alcoholicBeverages && newSworn.psychoactiveMedication && newSworn.familyProblem;
            res.status(201).json({
                success: isAvailable,
                data: newSworn,
            });
        }));
        this.deleteSworn = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield this.swornService.deleteSworn(id);
            res.status(200).json({
                success: true,
                data: {},
            });
        }));
    }
}
exports.SwornController = SwornController;
