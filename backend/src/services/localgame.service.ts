import { getCurrentDate } from '../lib/timeHelper';

import { CreateLocalGameRequest } from '../schema/type';
import { prisma } from '../plugins/prisma';

function localGameService() {
  const createLocalGame = async (
    createLocalGameRequest: CreateLocalGameRequest,
    userId: number,
  ) => {
    const newLocalGame = {
      userId: userId,
      user1Nickname: createLocalGameRequest.user1_nickname,
      user1Score: createLocalGameRequest.user1_score,
      user2Nickname: createLocalGameRequest.user2_nickname,
      user2Score: createLocalGameRequest.user2_score,
      scheduledAt: getCurrentDate(),
    };
    await prisma.singleMatch.create({ data: newLocalGame });
  };

  const readLocalGame = async (
    userId: number,
    current_page: number,
    offset: number,
  ) => {
    const skip = (current_page - 1) * offset;

    let records = await prisma.singleMatch.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: offset,
    });

    const total_records = await prisma.singleMatch.count({
      where: { userId },
    });

    const total_page = Math.ceil(total_records / offset);

    return {
      data: {
        total_page,
        current_page,
        records,
      },
    };
  };

  return {
    createLocalGame,
    readLocalGame,
  };
}

export default localGameService();
