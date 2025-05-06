import { FastifyInstance } from "fastify"

import { verifyAccessToken } from "../lib/jwt"
import { createLocalGameSchema } from "../schema"
import localGameHandler from "../handlers/localgame.handler"

const localGameRoute = async (fastify: FastifyInstance) => {
    fastify.post('/create', { schema: createLocalGameSchema, preHandler: [verifyAccessToken] }, localGameHandler.createLocalGame);
}

export default localGameRoute