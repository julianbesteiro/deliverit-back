'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.disconnect = exports.connect = void 0;
const mongoose_1 = __importDefault(require('mongoose'));
const config_1 = __importDefault(require('../config'));
let MONGO_URL;
switch (config_1.default.node_env) {
  case 'development':
    MONGO_URL = config_1.default.db.local_url;
    break;
  case 'production':
    MONGO_URL = config_1.default.db.producction_url;
    break;
  case 'test':
    MONGO_URL = config_1.default.db.test_url;
    break;
  default:
    MONGO_URL = config_1.default.db.local_url;
}
/**
 * 0 = disconnected
 * 1 = Conenected
 * 2 = Connecting
 * 3 = Disconnecting
 */
const mongoConnection = {
  isConnected: 0,
};
const connect = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (mongoConnection.isConnected) {
      console.log('Ya estamos conectados');
      return;
    }
    if (mongoose_1.default.connections.length > 0) {
      mongoConnection.isConnected = mongoose_1.default.connections[0].readyState;
      if (mongoConnection.isConnected === 1) {
        console.log('Usando Conexion Anterior');
        return;
      }
      yield mongoose_1.default.disconnect();
    }
    yield mongoose_1.default.connect(MONGO_URL || '');
    mongoConnection.isConnected = 1;
    console.log('Conectado a MongoDb', MONGO_URL);
  });
exports.connect = connect;
const disconnect = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') return;
    if (mongoConnection.isConnected === 0) return;
    yield mongoose_1.default.disconnect();
    mongoConnection.isConnected = 0;
    console.log('Desconectado de MongoDB');
  });
exports.disconnect = disconnect;
