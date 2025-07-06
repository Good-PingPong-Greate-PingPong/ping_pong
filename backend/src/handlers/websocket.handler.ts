import { FastifyRequest, WebSocketQuery } from 'fastify';
import { jwtUtil, userOnlineUtil } from '../lib';
import { tournamentManager, tournamentWaitingRoom } from '../lib/global.util';
import tournamentService from '../services/tournament.service';
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

  const tournamentSocketConnect = async (
    socket: WS.WebSocket,
    req: FastifyRequest<WebSocketQuery>,
  ) => {
    try {
      const token = req.query.token;
      const decoded = jwtUtil.coreVerifyToken(token, jwtUtil.tokenTypes.access);
      const userId = decoded.userId;

      const result = await tournamentService.startTournament(userId, socket);
      const tournament = result?.tournament.id;

      // 연결 종료 이벤트 감지
      socket.on('close', () => {
        console.log(`🔴 User ${userId} disconnected`);
        tournamentWaitingRoom.removePlayer(userId);
      });
    } catch (err) {
      console.error('❌ Tournament WebSocket connection error:', err);
      socket.close();
    }
  };

  return { userSocketConnect, tournamentSocketConnect };
};

export default websocketHandler();
