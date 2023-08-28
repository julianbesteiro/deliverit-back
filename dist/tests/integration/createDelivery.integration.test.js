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
const request = require('supertest');
const { ObjectId } = require('mongodb');
const app = require('../../src/server.ts');
const db = require('../../config/db');
const Delivery = require('../../src/schemas/delivery.schema');
describe('POST /api/deliveries', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Conectar a la base de datos de prueba antes de ejecutar las pruebas
        yield db.connect();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Desconectar de la base de datos de prueba y cerrar el servidor después de las pruebas
        yield db.disconnect();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Limpiar los datos después de cada prueba
        yield Delivery.deleteMany({});
    }));
    it('should create a new delivery', () => __awaiter(void 0, void 0, void 0, function* () {
        const newDelivery = {
            destinationLocation: { lat: 123, lng: 456 },
            orderId: new ObjectId(),
            userId: new ObjectId(),
            // Otros campos necesarios para crear una entrega
        };
        // Realizar una solicitud POST a la ruta de creación de entregas
        const response = yield request(app).post('/api/delivery').send(newDelivery);
        // Verificar la respuesta
        expect(response.statusCode).toBe(201); // Código de estado 201 para "Created"
        expect(response.body.destinationLocation.lat).toBe(newDelivery.destinationLocation.lat);
        // Verificar que la entrega haya sido creada en la base de datos
        const delivery = yield Delivery.findOne({ _id: response.body._id });
        if (delivery) {
            expect(delivery).toBeDefined();
            expect(delivery.orderId.toString()).toBe(newDelivery.orderId.toString());
        }
    }));
});
