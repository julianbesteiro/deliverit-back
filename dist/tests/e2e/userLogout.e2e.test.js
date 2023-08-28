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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const db_1 = require("../../config/db/db");
const User_1 = __importDefault(require("../../src/models/User"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
let token;
describe('POST /user/logout', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.connect)();
        yield User_1.default.create({
            name: 'Rafaella',
            lastName: 'Carra',
            email: 'rafaella@example.com',
            password: '0303456lalala',
        });
        const res = yield (0, supertest_1.default)(app).post('/user/login').send({
            email: 'rafaella@example.com',
            password: '0303456lalala',
        });
        token = res.body.token;
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_1.connect)();
        yield User_1.default.deleteOne({ email: 'rafaella@example.com' });
        yield (0, db_1.disconnect)();
    }), 10000);
    it('should logout user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/user/logout')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('User logged out successfully');
    }));
    it("shouldn't access protected routes after logout", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            //REPLACE FOR ANY PROTECTED ROUTE
            .get('/secret')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(401);
        expect(response.text).toMatch(/Unauthorized/);
    }));
});
