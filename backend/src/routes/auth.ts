import { FastifyInstance } from 'fastify';
import { googleCallbackHandler } from '../handlers';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.get('/google/callback', googleCallbackHandler);
}
