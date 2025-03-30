import { config } from './config';
import { buildApp } from './startup';
import { logger } from './lib';

const startServer = async () => {
  const app = await buildApp();

  process.on('SIGINT', async () => {
    logger.log('🛑 SIGINT received. Shutting down gracefully...');
    await app.close();
    process.exit(0);
  });

  try {
    await app.listen({ port: config.port, host: '127.0.0.1' });
    logger.log(`Server is running on port ${config.port}`);
  } catch (error) {
    logger.error(`Error starting server: ${error}`);
    process.exit(1);
  }
};

startServer();
