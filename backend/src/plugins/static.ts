import fp from 'fastify-plugin';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { env } from '../config/env';

export default fp(async (fastify) => {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, `../../${env.uploadDir}`),
    prefix: `/${env.uploadDir}/`,
  });
});
