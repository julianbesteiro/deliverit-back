"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swornRouter = void 0;
const sworn_controller_1 = require("../controllers/sworn.controller");
const Sworn_1 = __importDefault(require("../models/Sworn"));
const sworn_repository_1 = __importDefault(require("../repository/sworn.repository"));
const sworn_service_1 = __importDefault(require("../services/sworn.service"));
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.swornRouter = router;
const swornRepository = new sworn_repository_1.default(Sworn_1.default);
const swornService = new sworn_service_1.default(swornRepository);
const swornController = new sworn_controller_1.SwornController(swornService);
router.post('/', swornController.createSworn);
