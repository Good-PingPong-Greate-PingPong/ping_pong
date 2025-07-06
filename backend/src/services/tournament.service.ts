import { prisma } from '../plugins/prisma';
import * as WS from 'ws';
import { Prisma } from '@prisma/client';
import { tournamentManager, tournamentWaitingRoom } from '../lib/global.util';
import { pingpongUtil } from '../lib';

const tournamentService = () => {
  const readTournament = async (userId: number, currentPage: number) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('');
    }

    //해당 유저가 참여한 모든 토너먼트 불러오기
    const rawLists = await prisma.participant.findMany({
      where: {
        userId,
        isDeleted: false,
        tournament: { isDeleted: false },
      },
      select: {
        tournamentId: true,
        tournament: {
          select: {
            createdAt: true,
          },
        },
      },
      orderBy: {
        tournament: {
          createdAt: 'desc',
        },
      },
    });

    //중복 토너먼트 제거
    const seen = new Set<number>();
    const tournamentLists = rawLists.filter((entry: any) => {
      //any type!!!!
      if (seen.has(entry.tournamentId)) return false;
      seen.add(entry.tournamentId);
      return true;
    });

    const totalPage = tournamentLists.length;

    const currentTournamentId = tournamentLists[currentPage - 1]?.tournamentId;
    if (!currentTournamentId) {
      return { total_page: totalPage, current_page: currentPage, records: [] };
    }

    //해당 토너먼트의 모든 매치 불러오기
    const matches = await prisma.match.findMany({
      where: {
        isDeleted: false,
        participant1: {
          tournamentId: currentTournamentId, // 해당 토너먼트 ID
        },
      },
      include: {
        participant1: {
          include: {
            user: {
              select: {
                nickname: true,
                profileImage: true,
              },
            },
          },
        },
        participant2: {
          include: {
            user: {
              select: {
                nickname: true,
                profileImage: true,
              },
            },
          },
        },
        matchResults: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'desc' },
          take: 1, // 최신 결과만
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    //매치 정보 포맷
    const records = matches.map((match: any) => {
      //any type!!!
      const result = match.matchResults[0];
      return {
        nickname1: match.participant1.user.nickname,
        nickname2: match.participant2.user.nickname,
        user1Image: match.participant1.user.profileImage,
        user2Image: match.participant2.user.profileImage,
        score1: result?.participant1Score ?? null, //null로 넘길까?
        score2: result?.participant2Score ?? null,
        timestamp: match.scheduledAt.toISOString(),
      };
    });

    return {
      data: {
        totalPage,
        currentPage,
        records,
      },
    };
  };

  const createTournament = async (
    players: [number, WS.WebSocket, string][],
  ) => {
    return await prisma.$transaction(async (tx) => {
      const tournament = await tx.tournament.create({
        data: {
          status: 'ongoing',
          startDatetime: new Date(),
          endDatetime: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      const participants = await Promise.all(
        players.map(([userId]) =>
          tx.participant.create({
            data: {
              userId,
              tournamentId: tournament.id,
            },
          }),
        ),
      );

      const match1 = await tx.match.create({
        data: {
          tournamentId: tournament.id,
          round: 'semi',
          participant1Id: participants[0].id,
          participant2Id: participants[1].id,
          scheduledAt: new Date(),
          status: 'ongoing',
        },
      });

      const match2 = await tx.match.create({
        data: {
          tournamentId: tournament.id,
          round: 'semi',
          participant1Id: participants[2].id,
          participant2Id: participants[3].id,
          scheduledAt: new Date(),
          status: 'ongoing',
        },
      });

      const finalMatch = await tx.match.create({
        data: {
          tournamentId: tournament.id,
          round: 'final',
          scheduledAt: new Date(),
          status: 'upcoming',
        },
      });

      return { tournament, participants, match1, match2, finalMatch };
    });
  };

  const startTournament = async (userId: number, socket: WS.WebSocket) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    tournamentWaitingRoom.addPlayer(userId, socket, user.nickname);
    if (tournamentWaitingRoom.size() < 4) return null;

    const players = Array.from(tournamentWaitingRoom.getAll()).map(
      ([id, info]) =>
        [id, info.socket, info.nickname] as [number, WS.WebSocket, string],
    );

    const { tournament, participants, match1, match2, finalMatch } =
      await createTournament(players);

    tournamentManager.createRoom(tournament.id, tournamentWaitingRoom.getAll());
    tournamentWaitingRoom.clear();

    pingpongUtil.sendTournamentTree(
      tournament.id,
      ['', ''], // 아직 승자 없음
      [
        [players[0][2], players[1][2]],
        [players[2][2], players[3][2]],
      ],
    );

    setTimeout(async () => {
      const semiMatches = [match1, match2];

      for (const match of semiMatches) {
        if (!match.participant1Id || !match.participant2Id) continue;
        const p1 = await prisma.participant.findUnique({
          where: { id: match.participant1Id },
          include: { user: true },
        });
        const p2 = await prisma.participant.findUnique({
          where: { id: match.participant2Id },
          include: { user: true },
        });
        if (!p1 || !p2) continue;

        // 매치 등록
        tournamentManager.registerMatchRoom(
          tournament.id,
          match.id,
          p1.user.id,
          p2.user.id,
        );

        // 세션 알림 전송
        pingpongUtil.sendSessionInfo(
          match.id,
          match.round,
          p1.user.nickname,
          p2.user.nickname,
        );

        // 매치 초기화 세팅 전송
        pingpongUtil.sendMatchInitSetting(
          match.id,
          p1.user.nickname,
          p2.user.nickname,
        );
      }
    }, 3000);

    return { tournamentId: tournament.id };
  };

  const startGame = async (tournamentId: number, userId: number) => {
    const room = tournamentManager.getRoom(tournamentId);
    if (!room) throw new Error('❌ 해당 토너먼트 룸이 없습니다');

    const match = await prisma.match.findFirst({
      where: {
        tournamentId,
        round: 'semi',
        status: 'ongoing',
        OR: [{ participant1: { userId } }, { participant2: { userId } }],
      },
      include: {
        participant1: { include: { user: true } },
        participant2: { include: { user: true } },
      },
    });

    if (!match) {
      console.warn('⚠️ 시작할 매치가 없습니다.');
      return;
    }

    if (!match.participant1 || !match.participant2) {
      console.warn('⚠️ 매치 참가자가 충분하지 않습니다.');
      return;
    }
    const nickname1 = match.participant1.user.nickname;
    const nickname2 = match.participant2.user.nickname;

    // 초기 게임 상태
    let ballX = 50;
    let ballY = 50;
    let ballSpeedX = 1;
    let ballSpeedY = 1;
    let paddle1Y = 50;
    let paddle2Y = 50;
    let score1 = 0;
    let score2 = 0;

    const gameInterval = setInterval(() => {
      // 간단한 공 움직임 로직 (예시)
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // 벽 충돌 감지
      if (ballY <= 0 || ballY >= 100) ballSpeedY *= -1;

      // 점수 로직 (좌우 경계에 공 닿았을 때)
      if (ballX <= 0) {
        score2 += 1;
        ballX = 50;
        ballY = 50;
      }
      if (ballX >= 100) {
        score1 += 1;
        ballX = 50;
        ballY = 50;
      }

      // 종료 조건
      if (score1 >= 5 || score2 >= 5) {
        clearInterval(gameInterval);
        // 나중에 match_end 메시지 보내기
        return;
      }

      pingpongUtil.sendMatchRun(tournamentId, {
        ball: { x: ballX, y: ballY },
        paddle1: { x: 10, y: paddle1Y },
        paddle2: { x: 90, y: paddle2Y },
        score: { player1: score1, player2: score2 },
      });
    }, 50); // 50ms 주기 (20fps)
  };
  const handleKeyInput = (matchId: number, userId: number, msg: any) => {
    const state = matchStateMap.get(matchId);
    if (!state) return;

    const { keyStates, player1Id, player2Id } = state;
    const key = msg.data.key_set;

    if (msg.subtype === 'key_down') {
      if (userId === player1Id) keyStates.p1.add(key);
      if (userId === player2Id) keyStates.p2.add(key);
    } else if (msg.subtype === 'key_up') {
      if (userId === player1Id) keyStates.p1.delete(key);
      if (userId === player2Id) keyStates.p2.delete(key);
    }
  };
  return {
    readTournament,
    startTournament,
    startGame,
  };
};

export default tournamentService();
