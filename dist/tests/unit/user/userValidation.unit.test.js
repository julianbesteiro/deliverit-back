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
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../../../config/db/db");
const schemas_1 = require("../../../src/schemas");
describe('User Schema Validation', () => {
    let User;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.connect)();
        User = mongoose_1.default.model('User', schemas_1.userSchema);
    }));
    it('should require a name', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = new User({
            lastName: 'Carra',
            email: 'rafaella@example.com',
            password: '0303456lalala',
        });
        let err = null;
        try {
            yield user.validate();
        }
        catch (error) {
            err = error;
        }
        expect(err === null || err === void 0 ? void 0 : err.message).toBeDefined();
        expect(err === null || err === void 0 ? void 0 : err.statusCode).toBe(400);
    }));
});
