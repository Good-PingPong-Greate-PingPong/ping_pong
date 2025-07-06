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
      if (result) {
        (socket as any).tournamentId = result.tournamentId;
      }
      socket.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());

          if (msg.type === 'game') {
            switch (msg.subtype) {
              case 'match_start': {
                const tournamentId = (socket as any).tournamentId;
                if (!tournamentId) {
                  console.warn('tournamentId 없음');
                  return;
                }
                tournamentService.startGame(tournamentId, userId);
                break;
              }

              case 'key_down':
              case 'key_up': {
                const tournamentId = (socket as any).tournamentId;
                if (!tournamentId) return;
                tournamentService.handleKeyInput(tournamentId, userId, msg); // 추후 구현
                break;
              }

              default:
                console.warn('❓ 알 수 없는 subtype:', msg.subtype);
            }
          } else if (msg.type === 'disconnect') {
            console.log(`🔴 User ${userId} disconnected from tournament`);
            socket.close();
          } else {
            console.warn('❓ 알 수 없는 메시지 type:', msg.type);
          }
        } catch (error) {
          console.error('❌ JSON 파싱 실패:', error);
        }
      });

      // ❌ 소켓 연결 종료 시
      socket.on('close', () => {
        console.log(`🔴 User ${userId} disconnected`);

        if (tournamentWaitingRoom.findPlayer(userId)) {
          tournamentWaitingRoom.removePlayer(userId);
        } else {
          const tournamentId = (socket as any).tournamentId;
          if (tournamentId) {
            tournamentService.endTournament(tournamentId, userId);
          }
        }
      });
    } catch (err) {
      console.error('❌ Tournament WebSocket connection error:', err);
      socket.close();
    }
  };

  return { userSocketConnect, tournamentSocketConnect };
};

export default websocketHandler();
