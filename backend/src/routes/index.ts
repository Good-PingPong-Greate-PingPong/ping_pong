import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth';

export async function registerRoutes(app: FastifyInstance) {
  await app.register(authRoutes, { prefix: '/auth' });
  //   await dummyRoutes(app);
  // 다른 라우터 추가 시 여기에 등록
}
