import 'fastify';
import { PrismaClient } from '@prisma/client';
import { OAuth2Namespace } from '@fastify/oauth2';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    googleOAuth2: OAuth2Namespace;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: string | object;
  }
}
import { JwtPayload } from 'jsonwebtoken';
declare module 'fastify' {
  interface TokenPayload extends JwtPayload {
    userId: number;
  }
}
