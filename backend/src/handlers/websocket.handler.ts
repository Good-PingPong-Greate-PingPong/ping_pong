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

  const tournamentSocketConnect = async (
    socket: WS.WebSocket,
    req: FastifyRequest<WebSocketQuery>,
  ) => {
    try {
      const token = req.query.token;
      const decoded = jwtUtil.coreVerifyToken(token, jwtUtil.tokenTypes.access);
      const userId = decoded.userId;

      const result = await tournamentService.startTournament(userId, socket);

      const tournamentId = result.tournament.id;

      socket.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());

          switch (msg.type) {
            case 'game':
              tournamentService.startGame(tournamentId, userId);
              break;
            case 'disconnect':
              tournamentService.endTournament();
              break;
            default:
              console.warn('❓ 알 수 없는 메시지:', msg);
          }
        } catch (error) {
          console.error('❌ JSON 파싱 실패:', error);
        }
      });

      socket.on('close', () => {
        console.log(`🔴 User ${userId} disconnected`);
        userGameUtil.removeGameUser(userId);
      });
    } catch (err) {
      console.error('❌ Tournament WebSocket connection error:', err);
      socket.close();
    }
  };

  return { userSocketConnect, tournamentSocketConnect };
};

export default websocketHandler();
