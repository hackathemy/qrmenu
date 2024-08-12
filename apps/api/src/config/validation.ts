import * as joi from 'joi';

export default joi.object({
  NODE_ENV: joi
    .string()
    .valid('local', 'development', 'production', 'test')
    .default('local'),

  PORT: joi.number().default(8000),

  DATABASE_HOST: joi.string().required(),
  DATABASE_PORT: joi.number().required(),
  DATABASE_USER: joi.string().required(),
  DATABASE_PASSWORD: joi.string().required(),
  DATABASE_NAME: joi.string().required(),
  DATABASE_CERT: joi.string().required(),

  JWT_SECRET: joi.string().required(),

  AWS_ACCESS_KEY_ID: joi.string().required(),
  AWS_SECRET_ACCESS_KEY: joi.string().required(),
  AWS_DEFAULT_REGION: joi.string().required(),
  AWS_S3_BUCKET: joi.string().required(),
});
