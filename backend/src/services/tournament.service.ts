import { prisma } from '../plugins/prisma';
import * as WS from 'ws';
import { Prisma } from '@prisma/client';
import { tournamentManager, tournamentWaitingRoom } from '../lib/global.util';
import { pingpongUtil } from '../lib';

// 추가 상태 맵
const matchStartReadyMap = new Map<number, Set<number>>();

// 상태 구조에 gameState 추가
type MatchState = {
  player1Id: number;
  player2Id: number;
  keyStates: {
    p1: Set<string>;
    p2: Set<string>;
  };
  gameState: {
    ballX: number;
    ballY: number;
    ballSpeedX: number;
    ballSpeedY: number;
    paddle1Y: number;
    paddle2Y: number;
    score1: number;
    score2: number;
  };
};

const matchStateMap = new Map<number, MatchState>();

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
      return { totalPage: totalPage, currentPage: currentPage, records: [] };
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

  const handleMatchStart = async (matchId: number, userId: number) => {
    if (!matchStartReadyMap.has(matchId)) {
      matchStartReadyMap.set(matchId, new Set());
    }

    const readySet = matchStartReadyMap.get(matchId)!;
    readySet.add(userId);

    if (!matchStateMap.has(matchId)) {
      await startGame(matchId, userId); // ballSpeed = 0 상태
    }

    // 두 명 모두 준비 완료 → 공 시작
    if (readySet.size === 2) {
      matchStartReadyMap.delete(matchId);

      const state = matchStateMap.get(matchId);
      if (!state) return;

      const speedMagnitudeX = 1;
      const speedMagnitudeY = 0.5 + Math.random();
      const randomDirection = () => (Math.random() < 0.5 ? -1 : 1);

      state.gameState.ballSpeedX = speedMagnitudeX * randomDirection();
      state.gameState.ballSpeedY = speedMagnitudeY * randomDirection();
    }
  };

  // 게임 루프 분리
  const startGameLoop = (
    matchId: number,
    nickname1: string,
    nickname2: string,
    match: any,
  ) => {
    const interval = setInterval(async () => {
      const state = matchStateMap.get(matchId);
      if (!state) {
        clearInterval(interval);
        return;
      }

      const { gameState } = state;

      // paddle 위치 업데이트
      for (const key of state.keyStates.p1) {
        if (key === 'ArrowUp')
          gameState.paddle1Y = Math.max(0, gameState.paddle1Y - 2);
        if (key === 'ArrowDown')
          gameState.paddle1Y = Math.min(500, gameState.paddle1Y + 2);
      }
      for (const key of state.keyStates.p2) {
        if (key === 'ArrowUp')
          gameState.paddle2Y = Math.max(0, gameState.paddle2Y - 2);
        if (key === 'ArrowDown')
          gameState.paddle2Y = Math.min(500, gameState.paddle2Y + 2);
      }

      // 공 정지 상태면 무시
      if (gameState.ballSpeedX === 0 && gameState.ballSpeedY === 0) {
        return;
      }

      // 공 위치 갱신
      gameState.ballX += gameState.ballSpeedX;
      gameState.ballY += gameState.ballSpeedY;

      // 위아래 벽
      if (gameState.ballY <= 15 || gameState.ballY >= 1485) {
        gameState.ballSpeedY *= -1;
      }
      // 왼쪽 패들 (player 1) 충돌 판정
      if (
        gameState.ballX <= 90 && // 공이 왼쪽 근처에 왔고
        gameState.ballY < gameState.paddle1Y + 130 &&
        gameState.ballY > gameState.paddle1Y - 30
      ) {
        gameState.ballSpeedX *= -1;
      }

      // 오른쪽 패들 (player 2) 충돌 판정
      if (
        gameState.ballX >= 1410 && // 공이 오른쪽 근처에 왔고
        gameState.ballY < gameState.paddle2Y + 130 &&
        gameState.ballY > gameState.paddle2Y - 30
      ) {
        gameState.ballSpeedX *= -1;
      }
      // 좌우 벽 충돌 및 점수
      if (gameState.ballX <= 0 || gameState.ballX >= 1500) {
        if (gameState.ballX <= 0) gameState.score2 += 1;
        else gameState.score1 += 1;

        gameState.ballX = 750;
        gameState.ballY = 300;
        gameState.ballSpeedX = 0;
        gameState.ballSpeedY = 0;

        pingpongUtil.sendMatchInitSetting(
          matchId,
          nickname1,
          nickname2,
          gameState.score1,
          gameState.score2,
        );

        matchStartReadyMap.set(matchId, new Set());
        return;
      }

      // 게임 종료 조건
      if (gameState.score1 >= 5 || gameState.score2 >= 5) {
        clearInterval(interval);
        matchStateMap.delete(matchId);
        const winner = gameState.score1 >= 5 ? nickname1 : nickname2;

        await prisma.match.update({
          where: { id: matchId },
          data: { status: 'completed' },
        });
        await prisma.matchResult.create({
          data: {
            matchId,
            participant1Score: gameState.score1,
            participant2Score: gameState.score2,
            isGiveUp: false,
          },
        });

        pingpongUtil.sendMatchEnd(
          matchId,
          match.round,
          {
            player1: gameState.score1,
            player2: gameState.score2,
          },
          winner,
        );

        await checkAndStartFinal(match.tournamentId);
        return;
      }

      pingpongUtil.sendMatchRun(matchId, {
        ball: { x: gameState.ballX, y: gameState.ballY },
        paddle1: { x: 75, y: gameState.paddle1Y },
        paddle2: { x: 1450, y: gameState.paddle2Y },
        score: {
          player1: gameState.score1,
          player2: gameState.score2,
        },
      });
    }, 50);
  };

  // startGame 내부에서 상태 초기화 후 루프 시작
  const startGame = async (matchId: number, userId: number) => {
    const match_data = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        participant1: { include: { user: true } },
        participant2: { include: { user: true } },
      },
    });
    if (!match_data || !match_data.participant1 || !match_data.participant2)
      return;

    const p1Id = match_data.participant1.user.id;
    const p2Id = match_data.participant2.user.id;
    const nickname1 = match_data.participant1.user.nickname;
    const nickname2 = match_data.participant2.user.nickname;

    // 상태 저장
    matchStateMap.set(matchId, {
      player1Id: p1Id,
      player2Id: p2Id,
      keyStates: { p1: new Set(), p2: new Set() },
      gameState: {
        ballX: 750,
        ballY: 300,
        ballSpeedX: 0,
        ballSpeedY: 0,
        paddle1Y: 250,
        paddle2Y: 250,
        score1: 0,
        score2: 0,
      },
    });

    // 게임 루프는 대기 상태로 돌입
    startGameLoop(matchId, nickname1, nickname2, match_data);
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
    handleMatchStart,
  };
};

export default tournamentService();
