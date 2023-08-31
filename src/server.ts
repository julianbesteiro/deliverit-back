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
import { handleError } from './middlewares';

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

// Express configuration
app.use(
  cors({
    origin: dev ? config.cors.cors_origin : config.cors.cors_origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);

app.use(morgan('combined'));

// Middleware
app.get('/secret', isAuth, (_req, res) => {
  res.json({
    message: 'Hello World !',
  });
});

app.use(express.json({ limit: '50mb' }));
app.use(helmet());

// Your router
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hello World!');
});

// Mount the router on a specific path (e.g., "/api")
app.use('/api', allRoutes);
app.use(handleError);

app.listen(port, () => {
  logger.debug('debug right before info');
  logger.info(`> Ready on ${dev ? config.server.local_url : config.server.producction_url}`);
});

export default app;
