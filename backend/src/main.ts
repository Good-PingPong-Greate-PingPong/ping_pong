import Fastify from 'fastify';
import { config } from './config';
import { registerRoutes } from './routes';
import { init } from './startup';
import { logger } from './lib';

const app = Fastify({ logger: { level: 'error' } });

const startServer = async () => {
  try {
    // 초기화 작업 수행 (예: DB 연결)
    await init();

    // 라우터 등록
    await registerRoutes(app);

    // 서버 시작
    await app.listen({ port: config.port, host: '127.0.0.1' });
    logger.log(`Server is running on port ${config.port}`);
  } catch (error) {
    logger.error(`Error starting server: ${error}`);
    process.exit(1);
  }
};

startServer();
