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
exports.canSubmitSworn = void 0;
const Sworn_1 = __importDefault(require("../models/Sworn"));
const sworn_repository_1 = __importDefault(require("../repository/sworn.repository"));
const canSubmitSworn = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const swornRepo = new sworn_repository_1.default(Sworn_1.default);
    const lastSwornStatement = yield swornRepo.getLastSwornStatement(userId);
    if (!lastSwornStatement) {
        return true;
    }
    const currentDate = new Date();
    const lastSubmissionDate = new Date(lastSwornStatement.createdAt);
    //Check if the last submission was made on the same day
    if (currentDate.toDateString() === lastSubmissionDate.toDateString()) {
        return false;
    }
    return true;
});
exports.canSubmitSworn = canSubmitSworn;
