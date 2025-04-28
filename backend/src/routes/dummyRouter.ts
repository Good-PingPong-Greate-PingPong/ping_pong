import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { SUCCESS_MESSAGE, ERROR_MESSAGE } from '../lib'; // 상대 경로로 상수 가져오기

export async function dummyRoutes(app: FastifyInstance) {
  app.get('/dummy', async (req: FastifyRequest, reply: FastifyReply) => {
    // 예시: 사용자 목록 조회 응답
    return {
      ...SUCCESS_MESSAGE.accessTokenOK,
      data: [{ id: 1, name: 'Alice' }],
    };
  });

  app.post('/dummy', async (req: FastifyRequest, reply: FastifyReply) => {
    // 예시: 사용자 생성 로직. 이미 등록된 사용자의 경우 ERROR_MESSAGE 반환
    // 실제 로직에 따라 처리하세요.
    return reply
      .code(ERROR_MESSAGE.friendAddError.status)
      .send(ERROR_MESSAGE.friendAddError);
  });
}
