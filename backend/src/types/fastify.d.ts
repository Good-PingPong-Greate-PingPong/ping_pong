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

  // ✅ 친구 목록 요청용 타입
  interface FriendListQuery {
    Querystring: {
      page?: number;
    };
  }

  // ✅ 친구 추가/삭제 요청용 타입
  interface ModifyFriendBody {
    Body: {
      receiverId: number;
    };
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
