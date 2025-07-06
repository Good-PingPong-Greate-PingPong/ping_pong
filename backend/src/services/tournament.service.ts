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
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error('User not found');

    tournamentWaitingRoom.addPlayer(userId, socket, user.nickname);
    socket.on('close', () => {
      tournamentWaitingRoom.removePlayer(userId);
    });
    if (tournamentWaitingRoom.size() < 4) return null;

    const players: [number, WS.WebSocket, string][] = Array.from(
      tournamentWaitingRoom.getAll(),
    ).map(([userId, info]) => [userId, info.socket, info.nickname]);

    const { tournament, participants, match1, match2, finalMatch } =
      await createTournament(players);

    tournamentManager.createRoom(tournament.id, tournamentWaitingRoom.getAll());
    tournamentWaitingRoom.clear();

    // 📡 2-1. 대진표 전송
    tournamentManager.boradcasting(
      tournament.id,
      JSON.stringify({
        type: 'game',
        subtype: 'tournament_tree',
        message: '',
        data: {
          winner: ['', ''],
          bracket: [
            [players[0][2], players[1][2]],
            [players[2][2], players[3][2]],
          ],
        },
      }),
    );

    // ⏱ 3초 후 초기 정보 전송
    setTimeout(() => {
      // match1
      const [userId1A, , nickname1A] = players[0];
      const [userId1B, , nickname1B] = players[1];
      pingpongUtil.sendSessionInfo(tournament.id, nickname1A, nickname1B);
      pingpongUtil.sendMatchInitSetting(tournament.id, nickname1A, nickname1B);

      // match2
      const [userId2A, , nickname2A] = players[2];
      const [userId2B, , nickname2B] = players[3];
      pingpongUtil.sendSessionInfo(tournament.id, nickname2A, nickname2B);
      pingpongUtil.sendMatchInitSetting(tournament.id, nickname2A, nickname2B);
    }, 3000);

    return {
      tournament,
      match1,
      match2,
      finalMatch,
    };
  };

  const startGame = async (tournamentId: number) => {};

  return {
    readTournament,
    startTournament,
  };
};

export default tournamentService();
