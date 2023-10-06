import currentEnv from '.';

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Deliverit API',
      version: '1.0.0',
      description:
        'Deliverit API. This is a REST API application made with Express and TypeScript to handle deliveries.',
    },
    servers: [
      {
        url: currentEnv.SERVER_URL + '/api',
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
