import Joi from 'joi';

interface AppEnvs {
  PORT: number;
  PRODUCTION: string;
  API_SERVERS: string;
}

const envsSchema = Joi.object({
  VITE_PRODUCTION: Joi.string().required(),
  VITE_PORT: Joi.number().required(),
  VITE_API_SERVERS: Joi.string().required(),
}).unknown(true);

const result = envsSchema.validate(import.meta.env);

if (result.error) {
  throw new Error(`⚠️ Config validation error: ${result.error.message}`);
}

const validatedEnv = result.value;

export const envs: AppEnvs = {
  PORT: Number(validatedEnv.VITE_PORT),
  PRODUCTION: validatedEnv.VITE_PRODUCTION,
  API_SERVERS: validatedEnv.VITE_API_SERVERS,
};
