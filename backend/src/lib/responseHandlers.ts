import exp from 'constants'; // check
import { FastifyReply } from 'fastify';

const handlerUtil = () => {
  const handleError = (
    reply: FastifyReply,
    errorType: { success: boolean; status: number; message: string },
    error?: any,
  ): void => {
    reply.log.error(error);
    reply.status(errorType.status).send(errorType);
  };

  const handleSuccess = (
    reply: FastifyReply,
    successType: { status: number; message: string },
    data?: object,
  ): void => {
    reply.status(successType.status).send({
      success: true,
      message: successType.message,
      data: data || {},
    });
  };

  return {
    handleError,
    handleSuccess,
  };
};

export default handlerUtil();
