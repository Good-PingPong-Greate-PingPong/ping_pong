import { env } from './env';

export const config = {
  port: parseInt(env.PORT, 10),
  // databaseUrl: env.DATABASE_URL,
};
