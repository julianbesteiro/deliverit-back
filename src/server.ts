import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import logger from './logger';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from '../config/db';
dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;

(async () => {
  try {
    mongoose.set('strictQuery', false);
    console.log(MONGO_URL);
    await db.connect();
    logger.info('connected to db');
    db.disconnect();

    // async tasks, for ex, inserting email templates to db
    // logger.info('finished async tasks');
  } catch (err) {
    console.log('error:' + err);
  }
})();

const app = express();

app.use(
  cors({
    origin: dev ? process.env.URL_APP : process.env.PRODUCTION_URL_APP,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);

app.use(helmet());

// Middleware
app.use(express.json({ limit: '50mb' }));

// Your router
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.send('¡Hola, mundo!');
});

// Mount the router on a specific path (e.g., "/api")
app.use('/api', router);

app.listen(port, () => {
  logger.debug('debug right before info');
  logger.info(`> Ready on ${dev ? process.env.URL_API : process.env.PRODUCTION_URL_API}`);
});
