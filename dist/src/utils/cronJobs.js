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
exports.resetUserEnabledStatus = void 0;
const cron_1 = require("cron");
const User_1 = __importDefault(require("../models/User"));
//Schedule a task to run every day at 12am
exports.resetUserEnabledStatus = new cron_1.CronJob('0 0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.updateMany({}, { enabled: false });
        console.log("Reset user's enabled status successfully");
    }
    catch (error) {
        console.error("Error resetting user's enabled status");
    }
}));
