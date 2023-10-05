import DEVELOPMENT from './development';
import PRODUCTION from './production';

const { NODE_ENV } = process.env;

let currentEnv = DEVELOPMENT;

if (NODE_ENV === 'production') {
  currentEnv = PRODUCTION;
}

export default currentEnv;
