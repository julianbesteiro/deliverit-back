import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import logger from './logger';
import cors from 'cors';
import { db } from '../db';
import { allRoutes } from './routes';
import morgan from 'morgan';
import { errorHandler } from './middlewares';
import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../config/swaggerOptions';
import { resetUserEnabledStatus } from './utils/cronJobs';
import currentEnv from '../config';

// Connect to MongoDB
(async () => {
  try {
    mongoose.set('strictQuery', false);
    await db.connect();
    db.disconnect();
  } catch (err) {
    console.log('error:' + err);
  }
})();

// Create Express server
const app = express();
app.use(express.json({ limit: '50mb' }));

// Express configuration
console.log('currentEnv.CORS_ORIGIN', currentEnv.CORS_ORIGIN);

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    credentials: true,
  }),
);

const specs = swaggerJsdoc(swaggerOptions);
app.use('/doc', swaggerUI.serve, swaggerUI.setup(specs));

app.use(morgan('combined'));
app.use(helmet());

// Mount the router on a specific path (e.g., "/api")
app.use('/api', allRoutes);
app.use(errorHandler);

resetUserEnabledStatus.start();

app.listen(currentEnv.PORT, () => {
  logger.debug('debug right before info');
  logger.info(`> Ready on ${currentEnv.SERVER_URL}`);
});

export default app;
