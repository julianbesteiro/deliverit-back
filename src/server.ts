import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import logger from './logger';
import cors from 'cors';
import { db } from '../config/db';
import { allRoutes } from './routes';
import morgan from 'morgan';
import config from '../config/config';
import isAuth from './middlewares/isAuth';
import { errorHandler } from './middlewares';

import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from 'config/swaggerOptions';

const dev = config.node_env !== 'production';
const port = config.server.port || 8000;

// Connect to MongoDB
(async () => {
  try {
    mongoose.set('strictQuery', false);
    await db.connect();
    logger.info('connected to db');
    db.disconnect();
  } catch (err) {
    console.log('error:' + err);
  }
})();

// Create Express server
const app = express();
app.use(express.json({ limit: '50mb' }));

// Express configuration
app.use(
  cors({
    origin: dev ? config.cors.cors_origin : config.cors.cors_origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(morgan('combined'));

// Middleware
app.get('/secret', isAuth, (_req, res) => {
  res.json({
    message: 'Hello World !',
  });
});

app.use(helmet());

// Your router
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hello World!');
});

// Mount the router on a specific path (e.g., "/api")
app.use('/api', allRoutes);
app.use(errorHandler);

app.listen(port, () => {
  logger.debug('debug right before info');
  logger.info(`> Ready on ${dev ? config.server.local_url : config.server.producction_url}`);
});

export default app;
