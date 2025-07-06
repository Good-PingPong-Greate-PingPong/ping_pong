import { prisma } from '../plugins/prisma';
import { getCurrentDate } from '../lib/timeHelper';

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

  return {
    readTournament,
  };
}

export default tournamentService();
