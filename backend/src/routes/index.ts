import fastify, { FastifyInstance } from "fastify";
import localGameRoute from './local.game'

const routes = async (fastify: FastifyInstance) => {
    await fastify.register(localGameRoute, {prefix: '/localgame'})
}

export default routes