import { getCurrentDate } from '../lib/timeHelper';

import { CreateLocalGameRequest } from '../schema/type';
import { prisma } from '../plugins/prisma';

import { Prisma } from '@prisma/client';

function localGameService() {
  const createLocalGame = async (
    createLocalGameRequest: CreateLocalGameRequest,
    userId: number,
  ) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const newLocalGame: Prisma.SingleMatchUncheckedCreateInput = {
      userId: userId,
      user1Nickname: createLocalGameRequest.user1Nickname,
      user1Score: createLocalGameRequest.user1Score,
      user2Nickname: createLocalGameRequest.user2Nickname,
      user2Score: createLocalGameRequest.user2Score,
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
