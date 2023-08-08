import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT;

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
    console.log('Ya estamos conectados');
    return;
  }
  if (mongoose.connections.length > 0) {
    mongoConnection.isConnected = mongoose.connections[0].readyState;

    if (mongoConnection.isConnected === 1) {
      console.log('Usando Conexion Anterior');
      return;
    }

    await mongoose.disconnect();
  }

  await mongoose.connect(`mongodb://localhost:${DB_PORT}/${DB_NAME}` || '');

  mongoConnection.isConnected = 1;
  console.log('Conectado a MongoDb', `mongodb://localhost:${DB_PORT}/${DB_NAME}`);
};

export const disconnect = async () => {
  if (process.env.NODE_ENV === 'development') return;

  if (mongoConnection.isConnected === 0) return;

  await mongoose.disconnect();

  mongoConnection.isConnected = 0;
  console.log('Desconectado de MongoDB');
};
