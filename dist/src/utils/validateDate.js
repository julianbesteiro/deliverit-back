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
exports.validateDate = void 0;
const customErrors_1 = require("../errors/customErrors");
function validateDate(date) {
    return __awaiter(this, void 0, void 0, function* () {
        const iso8601Pattern = /^\d{4}-\d{2}-\d{2}$/;
        const convertedDate = new Date(date);
        const day = Number(date.slice(8, 10));
        const month = Number(date.slice(5, 7));
        const year = Number(date.slice(0, 4));
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        if (!isNaN(convertedDate.getTime()) && iso8601Pattern.test(date.slice(0, 10))) {
            return { day, month, year, nextDay };
        }
        else {
            throw new customErrors_1.BadUserInputError({ id: 'Date format is not valid' });
        }
    });
}
exports.validateDate = validateDate;
