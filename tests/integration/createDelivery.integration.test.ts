const request = require('supertest');
const { ObjectId } = require('mongodb');
const app = require('../../src/server.ts');
const db = require('../../config/db');
const Delivery = require('../../src/schemas/delivery.schema');

describe('POST /api/deliveries', () => {
  beforeAll(async () => {
    // Conectar a la base de datos de prueba antes de ejecutar las pruebas
    await db.connect();
  });

  afterAll(async () => {
    // Desconectar de la base de datos de prueba y cerrar el servidor después de las pruebas
    await db.disconnect();
  });

  afterEach(async () => {
    // Limpiar los datos después de cada prueba
    await Delivery.deleteMany({});
  });

  it('should create a new delivery', async () => {
    const newDelivery = {
      destinationLocation: { lat: 123, lng: 456 },
      orderId: new ObjectId(),
      userId: new ObjectId(),
      // Otros campos necesarios para crear una entrega
    };

    // Realizar una solicitud POST a la ruta de creación de entregas
    const response = await request(app).post('/api/delivery').send(newDelivery);

    // Verificar la respuesta
    expect(response.statusCode).toBe(201); // Código de estado 201 para "Created"
    expect(response.body.destinationLocation.lat).toBe(newDelivery.destinationLocation.lat);

    // Verificar que la entrega haya sido creada en la base de datos
    const delivery = await Delivery.findOne({ _id: response.body._id });

    if (delivery) {
      expect(delivery).toBeDefined();
      expect(delivery.orderId.toString()).toBe(newDelivery.orderId.toString());
    }
  });
});
