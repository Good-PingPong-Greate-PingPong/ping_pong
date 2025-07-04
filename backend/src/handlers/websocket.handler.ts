import { FastifyRequest, WebSocketQuery } from 'fastify';
import { jwtUtil, userOnlineUtil } from '../lib';
import * as WS from 'ws';

const websocketHandler = () => {
  const userSocketConnect = async (
    socket: WS.WebSocket,
    req: FastifyRequest<WebSocketQuery>,
  ) => {
    try {
      const token = req.query.token;
      const decoded = jwtUtil.coreVerifyToken(token, jwtUtil.tokenTypes.access);
      const userId = decoded.userId;

      userOnlineUtil.addOnlineUser(userId, socket);
      console.log(`🟢 User ${userId} connected`);

      socket.on('close', () => {
        console.log(`🔴 User ${userId} disconnected`);
        userOnlineUtil.removeOnlineUser(userId);
      });
    } catch (err) {
      console.error('❌ WebSocket connection error:', err);
      socket.close();
    }
  };

  return { userSocketConnect };
};

export default websocketHandler();
