// import { transactionManager } from "../global/database/transaction.manager";

import { PrismaClient, Prisma } from "@prisma/client"

import { verifyAccessToken } from "../lib/jwt";
import { getCurrentDate } from "../lib/timeHelper";

import { CreateLocalGameRequest } from "../schema/types";
import { prisma } from "../plugins/prisma";

function localGameService() {
    const createLocalGame = async (createLocalGameRequest: CreateLocalGameRequest, userId:Number) => {
        try {
            const newLocalGame = {
                userId: userId,
                user1Nickname: createLocalGameRequest.user1_nickname,
                user1Score: createLocalGameRequest.user1_score,
                user2Nickname: createLocalGameRequest.user2_nickname,
                user2Score: createLocalGameRequest.user2_score,
                createdAt: getCurrentDate(),
                scheduledAt: getCurrentDate()
            };
            await prisma.SingleMatch.create({ data: newLocalGame });
            return [];
        }
        catch (error) {
            console.error("Error creating local game:", error);
            throw new Error("게임 저장 중 오류가 발생했습니다.");
        }
    };

    return { createLocalGame };
};

export default localGameService()