import { env } from './env';

export const config = {
  port: parseInt(env.PORT, 10),
  databaseUrl: env.DATABASE_URL,
  host: env.HOST,
  uploadDir: env.uploadDir,
  google: {
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    callbackUrl: env.googleCallbackUrl,
  },
  jwt: {
    secret: env.jwtSecret,
    expiresIn: '1h',
    refreshExpiresIn: '7d',
  },
  mailer: {
    user: env.mailerUser,
    pass: env.mailerPass,
    link: env.mailerLink,
  },
};
