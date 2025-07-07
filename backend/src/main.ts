import { config } from './config';
import { buildApp } from './startup';
import fs from 'fs';

const ensureUploadDirExists = () => {
  if (!fs.existsSync(config.uploadDir)) {
    fs.mkdirSync(config.uploadDir, { recursive: true });
    console.log(`📁 Created upload directory at ${config.uploadDir}`);
  }
};
const startServer = async () => {
  ensureUploadDirExists();
  const app = await buildApp();

  process.on('SIGINT', async () => {
    console.log('🛑 SIGINT received. Shutting down gracefully...'); // fix me
    await app.close();
    process.exit(0);
  });

  try {
    await app.listen({ port: config.port, host: config.host });
    console.log(`Server is running on port ${config.port}`); // fix me
  } catch (error) {
    console.error(`Error starting server: ${error}`); // fix me
    process.exit(1);
  }
};

startServer();
