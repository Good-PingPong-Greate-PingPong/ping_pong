import { env } from './env';

export const config = {
  port: parseInt(env.PORT, 10),
  databaseUrl: env.DATABASE_URL,
  google: {
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    callbackUrl: env.googleCallbackUrl,
  },
  jwt: {
    secret: env.jwtSecret,
    expiresIn: '1h',
  },
};
