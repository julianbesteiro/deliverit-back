import * as winston from 'winston';
import currentEnv from '../config';

const dev = currentEnv.NODE_ENV !== 'production';

const logger = winston.createLogger({
  format: winston.format.simple(),
  level: dev ? 'debug' : 'info',
  transports: [new winston.transports.Console()],
});

export default logger;
