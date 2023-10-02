import * as dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.string().required().default('5000'),
  LOCAL_SERVER_URL: Joi.string().required(),
  SERVER_URL: Joi.string().required(),
  CORS_ORIGIN: Joi.string().required().default('*'),
  ACCESS_TOKEN_SECRET: Joi.string().min(8).required(),
  ACCESS_TOKEN_EXPIRE: Joi.string().required().default('20m'),
  REFRESH_TOKEN_SECRET: Joi.string().min(8).required(),
  REFRESH_TOKEN_EXPIRE: Joi.string().required().default('1d'),
  REFRESH_TOKEN_COOKIE_NAME: Joi.string().required().default('jid'),
  MAX_NUMBER_OF_PACKAGES_PER_DAY: Joi.number().required().default(5),
  DATABASE_LOCAL_URL: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  DATABASE_URL_TEST: Joi.string().required(),
});

const { value: validatedEnv, error } = envSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env, { abortEarly: false, stripUnknown: true });

if (error) {
  throw new Error(
    `Environment variable validation error: \n${error.details
      .map((detail) => detail.message)
      .join('\n')}`,
  );
}

const config = {
  node_env: validatedEnv.NODE_ENV,
  db: {
    local_url: validatedEnv.DATABASE_LOCAL_URL,
    producction_url: validatedEnv.DATABASE_URL,
    test_url: validatedEnv.DATABASE_URL_TEST,
  },
  server: {
    port: validatedEnv.PORT,
    producction_url: validatedEnv.SERVER_URL,
    local_url: validatedEnv.LOCAL_SERVER_URL,
  },
  cors: {
    cors_origin: validatedEnv.CORS_ORIGIN,
  },
  constants: {
    max_number_of_packages_per_day: validatedEnv.MAX_NUMBER_OF_PACKAGES_PER_DAY,
  },
  jwt: {
    access_token: {
      secret: validatedEnv.ACCESS_TOKEN_SECRET,
      expire: validatedEnv.ACCESS_TOKEN_EXPIRE,
    },
    refresh_token: {
      secret: validatedEnv.REFRESH_TOKEN_SECRET,
      expire: validatedEnv.REFRESH_TOKEN_EXPIRE,
      cookie_name: validatedEnv.REFRESH_TOKEN_COOKIE_NAME,
    },
  },
} as const;

export default config;
