import fp from 'fastify-plugin';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../config/env';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default fp(async (fastify) => {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, `../../${env.uploadDir}`),
    prefix: `/${env.uploadDir}/`,
  });
});
