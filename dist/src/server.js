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
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const logger_1 = __importDefault(require("./logger"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("../config/db");
const routes_1 = require("./routes");
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("../config/config"));
const isAuth_1 = __importDefault(require("./middlewares/isAuth"));
const middlewares_1 = require("./middlewares");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions_1 = require("../config/swaggerOptions");
const cronJobs_1 = require("./utils/cronJobs");
const dev = config_1.default.node_env !== 'production';
const port = config_1.default.server.port || 8000;
// Connect to MongoDB
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.set('strictQuery', false);
        yield db_1.db.connect();
        logger_1.default.info('connected to db');
        db_1.db.disconnect();
    }
    catch (err) {
        console.log('error:' + err);
    }
}))();
// Create Express server
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '50mb' }));
// Express configuration
app.use((0, cors_1.default)({
    origin: dev ? config_1.default.cors.cors_origin : config_1.default.cors.cors_origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    credentials: true,
}));
const specs = (0, swagger_jsdoc_1.default)(swaggerOptions_1.swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
app.use((0, morgan_1.default)('combined'));
// Middleware
app.get('/secret', isAuth_1.default, (_req, res) => {
    res.json({
        message: 'Hello World !',
    });
});
app.use((0, helmet_1.default)());
// Your router
app.get('/', (req, res) => {
    res.send('¡Hello World!');
});
// Mount the router on a specific path (e.g., "/api")
app.use('/api', routes_1.allRoutes);
app.use(middlewares_1.errorHandler);
cronJobs_1.resetUserEnabledStatus.start();
app.listen(port, () => {
    logger_1.default.debug('debug right before info');
    logger_1.default.info(`> Ready on ${dev ? config_1.default.server.local_url : config_1.default.server.producction_url}`);
});
exports.default = app;
