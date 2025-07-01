import 'fastify';
import { PrismaClient } from '@prisma/client';
import { OAuth2Namespace } from '@fastify/oauth2';
import { Multipart, MultipartFile } from '@fastify/multipart';
import { JwtPayload } from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    googleOAuth2: OAuth2Namespace;
  }

  interface FastifyRequest {
    user: TokenPayload;
    isMultipart: () => boolean;
  }

  interface TokenPayload extends JwtPayload {
    userId: number;
  }

  interface WebSocketQuery {
    Querystring: {
      token: string;
    };
  }
}
