import { registerAs } from '@nestjs/config';
import { EnvConfig } from './env.validation';

export interface AppConfig {
  environment: string;
  port: number;
  jwt: {
    secret: string;
    expiration: string;
    expirationExchange: string;
  };
}

export default registerAs('app', (): AppConfig => {
  const env = process.env as unknown as EnvConfig;
  return {
    environment: env.ENV,
    port: Number(env.PORT),
    jwt: {
      secret: env.JWT_TOKEN,
      expiration: env.JWT_EXPIRATION,
      expirationExchange: env.JWT_EXPIRATION_EXCHANGE,
    },
  };
});