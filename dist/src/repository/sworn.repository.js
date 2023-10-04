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
const customErrors_1 = require("../errors/customErrors");
class SwornRepository {
    constructor(swornModel) {
        this.swornModel = swornModel;
    }
    create(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const swornCreated = yield this.swornModel.create(item);
            if (!swornCreated) {
                throw new customErrors_1.BadUserInputError({ message: 'Sworn not created' });
            }
            return swornCreated;
        });
    }
    //eslint-disable-next-line
    findAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                data: [],
                page: 1,
                totalPages: 1,
                totalItems: 1,
            };
        });
    }
    getLastSwornStatement(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //Find the last sworn statement
                const lastSwornStatement = yield this.swornModel
                    .find({ userId })
                    .sort({ createdAt: -1 })
                    .limit(1);
                return lastSwornStatement[0];
            }
            catch (error) {
                throw new customErrors_1.BadUserInputError({ message: 'Sworn not found' });
            }
        });
    }
    //eslint-disable-next-line
    findById(id, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                alcoholicBeverages: false,
                psychoactiveMedication: false,
                familyProblem: false,
                userId: '',
                swornStatementStatus: '',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        });
    }
    //eslint-disable-next-line
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                alcoholicBeverages: false,
                psychoactiveMedication: false,
                familyProblem: false,
                userId: '',
                swornStatementStatus: '',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        });
    }
    //eslint-disable-next-line
    delete(id, userId) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = SwornRepository;
