import { readLocalGamesSchema } from "../../schema/localGameSchema";
import { TCommonQuery } from "../../schema/types";
import { CATEGORY_TYPE } from "../../lib/constants";
import { FastifyReply, FastifyRequest } from "fastify";

fastify.route({
    method: 'GET',
    url:'/',
    schema: readLocalGamesSchema,
    handler: async(req:FastifyRequest<{Headers: TCommonHeaders, Querystring: TCommonQuery}>, rep: FastifyReply) => {

    }
})