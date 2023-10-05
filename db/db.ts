import mongoose from 'mongoose';
import currentEnv from '../config/index';
import logger from '../src/logger';

const MONGO_URL = currentEnv.DATABASE_URL || '';
/**
 * 0 = disconnected
 * 1 = Conenected
 * 2 = Connecting
 * 3 = Disconnecting
 */

const mongoConnection = {
  isConnected: 0,
};

export const connect = async () => {
  if (mongoConnection.isConnected) {
    logger.info('Ya estamos conectados');
    return;
  }
  if (mongoose.connections.length > 0) {
    mongoConnection.isConnected = mongoose.connections[0].readyState;

    if (mongoConnection.isConnected === 1) {
      logger.info('Usando Conexion Anterior');
      return;
    }

    await mongoose.disconnect();
  }

  await mongoose.connect(MONGO_URL || '');

  mongoConnection.isConnected = 1;
  logger.info('Conectado a MongoDb', MONGO_URL);
};

export const disconnect = async () => {
  if (currentEnv.NODE_ENV === 'development' || currentEnv.NODE_ENV === 'production') return;

  if (mongoConnection.isConnected === 0) return;

  await mongoose.disconnect();

  mongoConnection.isConnected = 0;
  logger.info('Desconectado de MongoDB');
};
