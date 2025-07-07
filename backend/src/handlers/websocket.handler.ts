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
      console.log('🟢 WebSocket connection established');
      const token = req.query.token;
      const decoded = jwtUtil.coreVerifyToken(token, jwtUtil.tokenTypes.access);
      const userId = decoded.userId;

      userOnlineUtil.addOnlineUser(userId, socket);
      console.log(`🟢 User ${userId} connected`);

      socket.on('close', (code: number, reason: Buffer) => {
        console.log(`🔴 User ${userId} disconnected`);
        console.log('⛔ 종료 코드:', code);
        console.log('📄 종료 이유:', reason.toString());
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
      if (!result) {
        console.warn('❌ 토너먼트 시작 실패');
        socket.close();
        return;
      }

      socket.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'game') {
            switch (msg.subtype) {
              case 'match_start': {
                tournamentService.handleMatchStart(msg.data.match_id, userId);
                break;
              }

              case 'key_down':
              case 'key_up': {
                tournamentService.handleKeyInput(
                  msg.data.match_id,
                  userId,
                  msg,
                );
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
          tournamentService.endTournament(userId);
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
