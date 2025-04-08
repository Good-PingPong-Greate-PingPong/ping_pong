import { FastifyInstance } from 'fastify';
import * as handler from '../handlers';

export async function loginRoutes(fastify: FastifyInstance) {
  fastify.get('/login', async (req, reply) => {
    reply.redirect('/auth/google');
  });
}

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/google/callback', handler.googleCallbackHandler);
}

export async function refreshRoutes(fastify: FastifyInstance) {
  fastify.post('/refresh', handler.refreshHandler);
}

export async function logoutRoutes(fastify: FastifyInstance) {
  fastify.post('/logout', handler.logoutHandler);
}
