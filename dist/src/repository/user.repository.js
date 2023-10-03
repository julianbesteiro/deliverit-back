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
class UserRepository {
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
            const user = yield User_1.default.findOne({ email });
            return user;
        });
    }
    static updateUserById(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield User_1.default.findByIdAndUpdate(id, updateData, { new: true });
                if (!updatedUser) {
                    throw new Error('User not found');
                }
                return updatedUser;
            }
            catch (error) {
                throw new Error('Error updating user');
            }
        });
    }
}
exports.UserRepository = UserRepository;
