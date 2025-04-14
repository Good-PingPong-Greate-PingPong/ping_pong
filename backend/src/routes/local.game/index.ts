import { FastifyInstance } from "fastify"

import { verifyAccessToken } from "../../lib/jwt"
import { createLocalGameSchema } from "../../schema"
import localGameController from "../../controller/local.game.controller"

const localGameRoute = async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'POST',
        schema: createLocalGameSchema,
        url: '/create',
        preHandler: [verifyAccessToken],
        handler: localGameController.createLocalGame
    })
}

export default localGameRoute