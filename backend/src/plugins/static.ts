import fp from 'fastify-plugin';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { env } from '../config/env';
import { userUtil } from '../lib';

const __dirname = userUtil.getDirname(import.meta.url);

export default fp(async (fastify) => {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, `../../${env.uploadDir}`),
    prefix: `/${env.uploadDir}/`,
  });
});
