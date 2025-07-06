import { prisma } from '../plugins/prisma';
import * as WS from 'ws';
import { Prisma } from '@prisma/client';
import { tournamentManager, tournamentWaitingRoom } from '../lib/global.util';
import { pingpongUtil } from '../lib';

const matchStateMap = new Map<
  number,
  {
    player1Id: number;
    player2Id: number;
    paddle1Y: number;
    paddle2Y: number;
    keyStates: {
      p1: Set<string>;
      p2: Set<string>;
    };
  }
>();

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
    players: [number, string][], // [userId, nickname]
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
          participant1Id: participants[0].id,
          participant2Id: participants[1].id,
          round: 'semi',
          status: 'ongoing',
          isDeleted: false,
        },
      });

      const match2 = await tx.match.create({
        data: {
          tournamentId: tournament.id,
          participant1Id: participants[2].id,
          participant2Id: participants[3].id,
          round: 'semi',
          status: 'ongoing',
          isDeleted: false,
        },
      });

      const finalMatch = await tx.match.create({
        data: {
          tournamentId: tournament.id,
          round: 'final',
          status: 'upcoming',
          isDeleted: false,
        },
      });

      return {
        tournament,
        participants,
        matches: [match1, match2, finalMatch],
      };
    });
  };

  const startTournament = async (userId: number, socket: WS.WebSocket) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    tournamentWaitingRoom.addPlayer(userId, socket, user.nickname);
    if (tournamentWaitingRoom.size() < 4) return null;

    const players = Array.from(tournamentWaitingRoom.getAll()).map(
      ([id, info]) => [id, info.nickname] as [number, string],
    );

    const { tournament, participants, matches } = await createTournament(
      players,
    );

    tournamentManager.createRoom(tournament.id, tournamentWaitingRoom.getAll());
    tournamentWaitingRoom.clear();

    pingpongUtil.sendTournamentTree(
      tournament.id,
      ['', ''],
      [
        [players[0][1], players[1][1]],
        [players[2][1], players[3][1]],
      ],
    );

    setTimeout(async () => {
      for (const match of matches.filter((m) => m.round === 'semi')) {
        const p1 = await prisma.participant.findUnique({
          where: { id: match.participant1Id! },
          include: { user: true },
        });
        const p2 = await prisma.participant.findUnique({
          where: { id: match.participant2Id! },
          include: { user: true },
        });
        if (!p1 || !p2) continue;

        tournamentManager.registerMatchRoom(
          tournament.id,
          match.id,
          p1.user.id,
          p2.user.id,
        );
        pingpongUtil.sendSessionInfo(
          match.id,
          match.round,
          p1.user.nickname,
          p2.user.nickname,
        );
        pingpongUtil.sendMatchInitSetting(
          match.id,
          p1.user.nickname,
          p2.user.nickname,
          0,
          0,
        );
      }
    }, 3000);

    return { tournamentId: tournament.id };
  };

  const startGame = async (matchId: number, userId: number) => {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });
    if (!match) {
      console.warn('⚠️ 유효하지 않은 matchId');
      return;
    }
    const match_data = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        participant1: { include: { user: true } },
        participant2: { include: { user: true } },
      },
    });

    if (!match_data || !match_data.participant1 || !match_data.participant2) {
      console.warn('⚠️ 참가자 정보 없음');
      return;
    }

    const p1Id = match_data.participant1.user.id;
    const p2Id = match_data.participant2.user.id;
    const nickname1 = match_data.participant1.user.nickname;
    const nickname2 = match_data.participant2.user.nickname;

    // 게임 상태 초기화
    let ballX = 50;
    let ballY = 50;
    let ballSpeedX = 1;
    let ballSpeedY = 1;
    let paddle1Y = 50;
    let paddle2Y = 50;
    let score1 = 0;
    let score2 = 0;

    matchStateMap.set(matchId, {
      player1Id: p1Id,
      player2Id: p2Id,
      paddle1Y,
      paddle2Y,
      keyStates: {
        p1: new Set(),
        p2: new Set(),
      },
    });

    const gameInterval = setInterval(() => {
      const state = matchStateMap.get(matchId);
      if (!state) {
        clearInterval(gameInterval);
        return;
      }

      // 키 입력에 따른 paddle 위치 갱신
      for (const key of state.keyStates.p1) {
        if (key === 'ArrowUp') state.paddle1Y = Math.max(0, state.paddle1Y - 2);
        if (key === 'ArrowDown')
          state.paddle1Y = Math.min(100, state.paddle1Y + 2);
      }
      for (const key of state.keyStates.p2) {
        if (key === 'ArrowUp') state.paddle2Y = Math.max(0, state.paddle2Y - 2);
        if (key === 'ArrowDown')
          state.paddle2Y = Math.min(100, state.paddle2Y + 2);
      }
      // 공 위치 갱신
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // 위아래 벽 충돌
      if (ballY <= 0 || ballY >= 100) ballSpeedY *= -1;

      // 좌우 벽 충돌: 점수 처리 및 리셋
      if (ballX <= 0) {
        score2 += 1;
        ballX = 50;
        ballY = 50;

        pingpongUtil.sendMatchInitSetting(
          matchId,
          nickname1,
          nickname2,
          score1,
          score2,
        );
      }
      if (ballX >= 100) {
        score1 += 1;
        ballX = 50;
        ballY = 50;

        pingpongUtil.sendMatchInitSetting(
          matchId,
          nickname1,
          nickname2,
          score1,
          score2,
        );
      }

      // 종료 조건
      if (score1 >= 5 || score2 >= 5) {
        clearInterval(gameInterval);
        matchStateMap.delete(matchId);
        const winner = score1 >= 5 ? nickname1 : nickname2;

        (async () => {
          // 1. Match 상태 업데이트
          await prisma.match.update({
            where: { id: matchId },
            data: {
              status: 'completed',
            },
          });

          // 2. MatchResult 저장
          await prisma.matchResult.create({
            data: {
              matchId,
              participant1Score: score1,
              participant2Score: score2,
              isGiveUp: false,
            },
          });

          // 3. 클라이언트에게 결과 전송
          pingpongUtil.sendMatchEnd(
            matchId,
            match.round,
            {
              player1: score1,
              player2: score2,
            },
            winner,
          );

          // 4. 결승 시작 확인 및 실행
          await checkAndStartFinal(match.tournamentId);
        })();
        return;
      }

      // 실시간 위치/상태 클라이언트에게 전송
      pingpongUtil.sendMatchRun(matchId, {
        ball: { x: ballX, y: ballY },
        paddle1: { x: 10, y: paddle1Y },
        paddle2: { x: 90, y: paddle2Y },
        score: { player1: score1, player2: score2 },
      });
    }, 50); // 20fps (50ms 간격)
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

  const endTournament = async (userId: number) => {
    // 1. 유저가 참여 중인 진행 중인 매치 찾기
    const matchData = await prisma.match.findFirst({
      where: {
        status: 'ongoing',
        isDeleted: false,
        OR: [
          { participant1: { user: { id: userId } } },
          { participant2: { user: { id: userId } } },
        ],
      },
      include: {
        participant1: { include: { user: true } },
        participant2: { include: { user: true } },
      },
    });

    if (!matchData || !matchData.participant1 || !matchData.participant2) {
      return;
    }

    const matchId = matchData.id;
    const p1Id = matchData.participant1.user.id;
    const p2Id = matchData.participant2.user.id;

    const isLoserPlayer1 = p1Id === userId;
    const loserNickname = isLoserPlayer1
      ? matchData.participant1.user.nickname
      : matchData.participant2.user.nickname;
    const winnerNickname = isLoserPlayer1
      ? matchData.participant2.user.nickname
      : matchData.participant1.user.nickname;

    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });
    if (!match) {
      console.warn('⚠️ 유효하지 않은 matchId');
      return;
    }
    const score = isLoserPlayer1
      ? { player1: 0, player2: 5 }
      : { player1: 5, player2: 0 };
    // 2. 클라이언트에 종료 메시지 전송
    pingpongUtil.sendMatchEnd(matchId, match.round, score, winnerNickname);

    // 3. MatchResult 저장
    await prisma.matchResult.create({
      data: {
        matchId,
        participant1Score: isLoserPlayer1 ? 0 : 5,
        participant2Score: isLoserPlayer1 ? 5 : 0,
        isGiveUp: true,
      },
    });

    // 4. 매치 상태 업데이트
    await prisma.match.update({
      where: { id: matchId },
      data: { status: 'completed' },
    });

    // 5. 서버 측 상태 제거
    matchStateMap.delete(matchId);

    console.log(`🏳️ ${loserNickname}의 기권으로 match ${matchId} 종료됨`);
    // 6. 결승 시작 확인 및 실행
    await checkAndStartFinal(match.tournamentId);
  };

  const checkAndStartFinal = async (tournamentId: number) => {
    const matches = await prisma.match.findMany({
      where: {
        tournamentId,
        isDeleted: false,
      },
    });

    const semiFinals = matches.filter((m) => m.round === 'semi');
    const finalMatch = matches.find((m) => m.round === 'final');

    if (!finalMatch || finalMatch.status !== 'upcoming') return;

    const completedSemi = semiFinals.filter((m) => m.status === 'completed');
    if (completedSemi.length < 2) return; // 아직 종료 안 된 세미파이널 있음

    // 세미 결승 결과로부터 승자 2명 찾기
    const results = await prisma.matchResult.findMany({
      where: {
        matchId: { in: semiFinals.map((m) => m.id) },
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 2,
    });

    if (results.length < 2) return;

    const winnerIds: number[] = [];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const match = semiFinals[i];

      const winnerParticipantId =
        result.participant1Score > result.participant2Score
          ? match.participant1Id
          : match.participant2Id;

      if (winnerParticipantId) winnerIds.push(winnerParticipantId);
    }

    if (winnerIds.length !== 2) return;

    // 결승 매치에 참가자 할당 + 상태 변경
    await prisma.match.update({
      where: { id: finalMatch.id },
      data: {
        participant1Id: winnerIds[0],
        participant2Id: winnerIds[1],
        status: 'ongoing',
      },
    });

    const [p1, p2] = await Promise.all([
      prisma.participant.findUnique({
        where: { id: winnerIds[0] },
        include: { user: true },
      }),
      prisma.participant.findUnique({
        where: { id: winnerIds[1] },
        include: { user: true },
      }),
    ]);

    if (!p1 || !p2) return;

    tournamentManager.registerMatchRoom(
      tournamentId,
      finalMatch.id,
      p1.user.id,
      p2.user.id,
    );

    pingpongUtil.sendSessionInfo(
      finalMatch.id,
      'final',
      p1.user.nickname,
      p2.user.nickname,
    );

    pingpongUtil.sendMatchInitSetting(
      finalMatch.id,
      p1.user.nickname,
      p2.user.nickname,
      0,
      0,
    );

    console.log(`🎯 결승전 시작: ${p1.user.nickname} vs ${p2.user.nickname}`);
  };

  return {
    readTournament,
    startTournament,
    startGame,
    handleKeyInput,
    endTournament,
  };
};

export default tournamentService();
