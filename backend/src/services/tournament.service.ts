import { prisma } from '../plugins/prisma';
import * as WS from 'ws';
import { Prisma } from '@prisma/client';
import { tournamentManager, tournamentWaitingRoom } from '../lib/global.util';

function tournamentService() {
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

  const startTournament = async (userId: number, socket: WS.WebSocket) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('');
    }

    //대기방 입장
    tournamentWaitingRoom.addPlayer(userId, socket, user.nickname);
    if (tournamentWaitingRoom.size() === 4) {
      const players = [...tournamentWaitingRoom.getAll()];

      const result = await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          //토너먼트 생성
          const tournament = await tx.tournament.create({
            data: {
              status: prisma.tournamentStatus.ongoing,
            },
          });

          //참여자 DB에 저장
          const participants = await Promise.all(
            players.map(([userId, socket]) =>
              tx.participant.create({
                data: {
                  userId,
                  tournamentId: tournament.id,
                },
              }),
            ),
          );

          //match DB에 저장
          const match1 = await tx.match.create({
            data: {
              tournamentId: result.tournament.id,
              round: prisma.matchRound.semi, // 준결승
              participant1Id: participants[0].id,
              participant2Id: participants[1].id,
              status: prisma.matchStatus.ongoing,
            },
          });

          const match2 = await tx.match.create({
            data: {
              tournamentId: result.tournament.id,
              round: prisma.matchRound.semi, // 준결승
              participant1Id: participants[2].id,
              participant2Id: participants[3].id,
              status: prisma.matchStatus.ongoing,
            },
          });

          const finalMatch = await tx.match.create({
            data: {
              tournamentId: result.tournament.id,
              round: prisma.matchRound.final, // 결승
              status: prisma.matchStatus.upcoming, // 결과 기다림
            },
          });

          return { tournament, participants, match1, match2, finalMatch };
        },
      );
      //Room 생성 및 participant 저장
      tournamentManager.createRoom(
        result.tournament.id,
        tournamentWaitingRoom.getAll(),
      );
      //대기방 초기화
      tournamentWaitingRoom.clear();
      //2-1. 클라이언트로 게임 대진표 정보 전송
      tournamentManager.boradcasting(
        result.tournament.id,
        JSON.stringify({
          type: 'game',
          subtype: 'tournament_tree',
          message: '',
          data: {
            winner: ['', ''],
            bracket: [
              [players[0], players[1]],
              [players[2], players[3]],
            ],
          },
        }),
      );
      //5초 대기
      setTimeout(() => {}, 5000);
      //3-1. 게임 시작 알림

      //4-1. 클라이언트로 매치 초기화 정보 전송

      return result;
    }
    return null;
  };

  const startGame = async (tournamentId: number) => {};

  return {
    readTournament,
    startTournament,
  };
}

export default tournamentService();
