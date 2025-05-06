import { FastifyReply } from 'fastify';

export const handleError = (
  reply: FastifyReply,
  errorType: { success: boolean; status: number; message: string },
  error?: any,
): void => {
  reply.log.error(error);
  reply.status(errorType.status).send(errorType);
};