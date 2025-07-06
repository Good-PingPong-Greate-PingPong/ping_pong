import dotenv from 'dotenv';

dotenv.config();

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value || '';
}

const isDev = process.env.NODE_ENV !== 'production'; // front test

export const env = {
  PORT: process.env.PORT || '3000',
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  HOST: process.env.HOST || 'localhost',

  googleClientId: getEnv('GOOGLE_CLIENT_ID'),
  googleClientSecret: getEnv('GOOGLE_CLIENT_SECRET'),
  // googleCallbackUrl: getEnv('GOOGLE_CALLBACK_URL'),
    googleCallbackUrl: isDev
    ? getEnv('GOOGLE_CALLBACK_URL_DEV')
    : getEnv('GOOGLE_CALLBACK_URL'),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',

  jwtSecret: getEnv('JWT_SECRET'),

  mailerUser: getEnv('MAILER_USER'),
  mailerPass: getEnv('MAILER_PASS'),
  mailerLink: getEnv('MAILER_LINK'),
  uploadDir: getEnv('UPLOAD_DIR'),
};
