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
    //eslint-disable-next-line
    findById(id, filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                alcoholicBeverages: false,
                psychoactiveMedication: false,
                familyProblem: false,
                userId: '',
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
            };
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const swornDeleted = this.swornModel.findByIdAndDelete(id);
            if (!swornDeleted) {
                throw new customErrors_1.BadUserInputError({ message: 'Sworn not deleted' });
            }
            return;
        });
    }
}
exports.default = SwornRepository;
