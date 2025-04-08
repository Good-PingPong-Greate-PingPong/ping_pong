import { FastifyInstance } from 'fastify';
import * as handler from '../handlers';
import { prisma } from '../plugins/prisma'; // delete me

export async function loginRoutes(fastify: FastifyInstance) {
  fastify.get('/login', async (req, reply) => {
    reply.redirect('/auth/google');
  });
}

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/google/callback', handler.googleCallbackHandler);
  fastify.get('/test/cookie', async (req, reply) => {
    const dummyToken = 'dummy_token_123';
    const dummyUserId = 1; // ⚠️ 테스트용으로 미리 DB에 존재하는 유저 ID를 사용해야 함!

    // DB에 저장
    await prisma.refreshToken.create({
      data: {
        userId: dummyUserId,
        token: dummyToken,
      },
    });

    // 쿠키로 내려보내기
    reply
      .setCookie('refreshToken', dummyToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/api/auth/refresh',
        maxAge: 60 * 60 * 24 * 7,
      })
      .send({ message: '테스트용 쿠키와 DB 등록 완료' });
  });
}

export async function refreshRoutes(fastify: FastifyInstance) {
  fastify.post('/refresh', handler.refreshHandler);
}

export async function logoutRoutes(fastify: FastifyInstance) {
  fastify.get('/logout', handler.logoutHandler);
}
