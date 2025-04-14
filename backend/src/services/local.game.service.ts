// import { transactionManager } from "../global/database/transaction.manager";

import { PrismaClient, Prisma } from "@prisma/client"

import { verifyAccessToken } from "../lib/jwt";
import { getCurrentDate } from "../lib/timeHelper";

import { CreateLocalGameRequest } from "../schema/types";

function localGameService() {
    const prisma = new PrismaClient();

    const createLocalGame = async (createLocalGameRequest: CreateLocalGameRequest) => {
        return await prisma.$transaction (async (tx: Prisma.TransactionClient) => {
            const userId = verifyAccessToken.request.userId; // userId 불러오기 테스트 필요
            const newLocalGame = {
                userId: userId,
                user1Nickname: createLocalGameRequest.user1_nickname,
                user1Score: createLocalGameRequest.user1_score,
                user2Nickname: createLocalGameRequest.user2_nickname,
                user2Score: createLocalGameRequest.user2_score,
                createdAt: getCurrentDate()
            };
            await tx.SingleMatch.create({ data: newLocalGame });
        });
    };

    return { createLocalGame };
};

export default localGameService()