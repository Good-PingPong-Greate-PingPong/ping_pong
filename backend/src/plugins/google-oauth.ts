import fp from 'fastify-plugin';
import fastifyOauth2 from '@fastify/oauth2';
import { env } from '../config/env';

export default fp(async (fastify) => {
  fastify.register(fastifyOauth2, {
    name: 'googleOAuth2',
    scope: ['email', 'profile'],
    credentials: {
      client: {
        id: env.googleClientId,
        secret: env.googleClientSecret,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: '/api/auth/google',
    callbackUri: env.googleCallbackUrl,
    generateStateFunction: () => 'test-state', // 테스트 끝나면 반드시 제거
    checkStateFunction: () => true, // 테스트 끝나면 반드시 제거
  });
});
