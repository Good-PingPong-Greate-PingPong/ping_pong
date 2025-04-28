import dotenv from 'dotenv';

dotenv.config();

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value || '';
}

export const env = {
  PORT: process.env.PORT || '3000',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  HOST: process.env.HOST || 'localhost',

  googleClientId: getEnv('GOOGLE_CLIENT_ID'),
  googleClientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
  googleCallbackUrl: getEnv('GOOGLE_CALLBACK_URL'),

  jwtSecret: getEnv('JWT_SECRET'),
};
