import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createLocalGameSchema } from "../../schema";
import { TCommonHeader, TlocalGameBody } from "../../schema/types";
import {handleError} from "../../lib/errorHelper"
import { ERROR_MESSAGE } "../../lib/constants"
import localGameService from "../../services/localGameService"
import { verifySignIn } from "../../lib/authHelper"

const localGameRoute = async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'POST',
        schema: createLocalGameSchema,
        url: '/',
        preHandler: [verifySignIn],
        handler: async(req:FastifyRequest<{Headers: TCommonHeader, Body: TlocalGameBody}>, rep: FastifyReply) => {
            const { user1_nickname, user2_nickname, user1_score, user2_score } = req.body
            const userId = req.user!.userId

            try {
                const result = await localGameService.createLocalGame(??????????????)
                rep.status(200).send(result)
            }
            catch (error) {
                handleError(rep, ERROR_MESSAGE.badRequest, error)
            }
        }
    })
}

export default localGameRoute