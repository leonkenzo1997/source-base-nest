import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  //App
  PORT: Joi.number().required(),
  JWT_ACCESS_TOKEN_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().min(1).required(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().min(1).required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().min(16).required(),
  //JWT_RESET_PASSWORD_SECRET: Joi.string().min(16).required(),

  // provision key for floor
  JWT_PROVISION_KEY_SECRET: Joi.string().min(1).required(),

  //Redis
  REDIS_HOST: Joi.string().min(1).required(),
  REDIS_PORT: Joi.number().required(),

  //Database
  DB_TYPE: Joi.string().min(1).required(),
  DB_HOST: Joi.string().min(1).required(),
  DB_USERNAME: Joi.string().min(1).required(),
  DB_PASSWORD: Joi.string().min(1).required(),
  DB_DATABASE: Joi.string().min(1).required(),
  DB_PORT: Joi.number().required(),

  //RABBITMQ
  // RABBITMQ_URL: Joi.string().min(1).required(),
  // RABBITMQ_QUEUE: Joi.string().min(1).required(),

  // azure
  AZURE_STORAGE_ACCOUNT_KEY: Joi.string().min(1).required(),
  AZURE_STORAGE_ACCOUNT_NAME: Joi.string().min(1).required(),
  AZURE_STORAGE_CONTAINER_NAME: Joi.string().min(1).required(),

  IOTHUB_HOSTNAME: Joi.string().min(1).required(),
  IOTHUB_SHARED_ACCESS_KEY: Joi.string().min(1).required(),
  IOTHUB_SHARED_ACCESS_KEY_NAME: Joi.string().min(1).required(),
  //AWS
  //   AWS_ACCESS_KEY_ID: Joi.string().min(1).required(),
  //   AWS_SECRET_ACCESS_KEY: Joi.string().min(1).required(),
  //   AWS_BUCKET: Joi.string().min(1).required(),
  //   AWS_REGION: Joi.string().min(1).required(),
  //MAIL
  //   MAIL_HOST: Joi.string().min(1).required(),
  //   MAIL_USER: Joi.string().min(1).required(),
  //   MAIL_PASSWORD: Joi.string().min(1).required(),
  //WEB
  // WEB_HOST: Joi.string().minWEB_URL: Joi.string().min(1).required(),

  //Hash password

  // encryption key
  SECRET_ENCRYPT_KEY: Joi.string().min(1).max(50).required(),
});
