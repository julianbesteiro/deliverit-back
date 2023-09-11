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
exports.UserService = void 0;
const tokens_1 = require("../utils/tokens");
const repository_1 = require("../repository");
const customErrors_1 = require("../errors/customErrors");
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = require("../utils/sendEmail");
class UserService {
    static userServiceTest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //logica random
                const maxUsers = id + 100;
                const userRepositoryData = yield repository_1.UserRepository.userRepositoryTest(maxUsers);
                console.log('test service');
                return userRepositoryData;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    static getUserData(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield repository_1.UserRepository.findUserById(id);
            if (!user) {
                throw new customErrors_1.UnauthorizedError('User not found');
            }
            return {
                id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                enabled: user.enabled,
                lastSeenAt: user.lastSeenAt,
                urlImage: user.urlImage,
            };
        });
    }
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield repository_1.UserRepository.createUser(user);
        });
    }
    static loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield repository_1.UserRepository.findUserByEmail(email);
            if (!user) {
                throw new customErrors_1.UnauthorizedError('User not found');
            }
            const isMatch = yield user.checkPassword(password);
            if (!isMatch) {
                throw new customErrors_1.UnauthorizedError('Invalid password');
            }
            const token = (0, tokens_1.generateToken)({ id: user._id });
            return token;
        });
    }
    static forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield repository_1.UserRepository.findUserByEmail(email);
            if (!user) {
                throw new customErrors_1.UnauthorizedError('User not found');
            }
            //This is to create a 6 digit code. If number is less than 6 digits, it will add 0s to the left
            const maxSixDigitNumber = 999999;
            const resetToken = ((parseInt(crypto_1.default.randomBytes(3).toString('hex'), 16) % maxSixDigitNumber) +
                1)
                .toString()
                .padStart(6, '0');
            const expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + 60);
            user.passwordReset = {
                token: resetToken,
                expiration,
            };
            yield user.save();
            (0, sendEmail_1.sendMail)(email, resetToken);
        });
    }
    static verifyResetToken(email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield repository_1.UserRepository.findUserByEmail(email);
            if (!user || !user.passwordReset) {
                return false;
            }
            if (user.passwordReset.token !== token || new Date() > user.passwordReset.expiration) {
                return false;
            }
            return true;
        });
    }
    static resetPassword(email, token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield repository_1.UserRepository.findUserByEmail(email);
            if (!user || !user.passwordReset) {
                throw new customErrors_1.UnauthorizedError('User not found');
            }
            if (user.passwordReset.token !== token || new Date() > user.passwordReset.expiration) {
                throw new customErrors_1.UnauthorizedError('Invalid token');
            }
            user.password = newPassword;
            user.passwordReset = undefined;
            yield user.save();
        });
    }
}
exports.UserService = UserService;
