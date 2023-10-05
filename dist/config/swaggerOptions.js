"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerOptions = void 0;
const _1 = __importDefault(require("."));
exports.swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Deliverit API',
            version: '1.0.0',
            description: 'Deliverit API. This is a REST API application made with Express and TypeScript to handle deliveries.',
        },
        servers: [
            {
                url: _1.default.SERVER_URL + '/api',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [
        './docs/user/*.yaml',
        './docs/admin/*.yaml',
        './docs/order/*.yaml',
        './docs/sworn/*.yaml',
        './docs/delivery/*.yaml',
    ],
};
