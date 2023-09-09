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
exports.UserRepository = void 0;
const User_1 = __importDefault(require("../models/User"));
const db_1 = require("../../config/db");
class UserRepository {
    static userRepositoryTest(maxUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield db_1.db.connect();
                const allUsers = yield User_1.default.find().limit(maxUsers);
                db_1.db.disconnect();
                console.log('test repository');
                return allUsers;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.findById(id);
        });
    }
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield User_1.default.create(user);
            return newUser;
        });
    }
    static findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.default.findOne({ email });
        });
    }
}
exports.UserRepository = UserRepository;
