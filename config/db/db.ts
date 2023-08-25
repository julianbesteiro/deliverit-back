import mongoose from 'mongoose';
import config from '../config';

const MONGO_URL: string = (() => {
  switch (config.node_env) {
    case 'production':
      return config.db.producction_url;
    case 'test':
      return config.db.test_url;
    default:
      return config.db.local_url;
  }
})();

class MongoConnection {
  private static instance: MongoConnection;
  private isConnected: number = 0;

  private constructor() {}

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Ya estamos conectados');
      return;
    }

    try {
      await mongoose.connect(MONGO_URL);
      this.isConnected = 1;
      console.log('Conectado a MongoDB', MONGO_URL);
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
    }
  }

  public async disconnect(): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    if (this.isConnected === 0) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = 0;
      console.log('Desconectado de MongoDB');
    } catch (error) {
      console.error('Error al desconectar de MongoDB:', error);
    }
  }
}

export default MongoConnection.getInstance();
