import fastify, { FastifyInstance } from "fastify";
import localGameRoute from './localgame'

const routes = async (fastify: FastifyInstance) => {
    await fastify.register(localGameRoute, {prefix: '/localgame'})
}

export default routes