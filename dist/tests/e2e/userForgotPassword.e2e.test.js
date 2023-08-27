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
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const db_1 = require("../../config/db/db");
const User_1 = __importDefault(require("../../src/models/User"));
const controllers_1 = require("../../src/controllers");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/user/forgot-password', controllers_1.UserController.forgotPassword);
describe('POST /user/forgot-password', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.connect)();
        yield User_1.default.create({
            name: 'Rafaella',
            lastName: 'Carra',
            email: 'rafaella@example.com',
            password: '0303456lalala',
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.connect)();
        yield User_1.default.deleteOne({ email: 'rafaella@example.com' });
        yield (0, db_1.disconnect)();
    }), 10000);
    it("should send a code to the user's email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/user/forgot-password').send({
            email: 'rafaella@example.com',
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Code sent to email');
    }));
    it("shouldn't send a code to a non-existing email", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post('/user/forgot-password').send({
            email: 'non-existent@example.com',
        });
        expect(response.status).toBe(400);
        expect(response.text).toMatch(/Email not found/);
    }));
});
