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
    successType: { success: boolean; status: number; message: string },
    data?: object,
  ): void => {
    console.log(
      '응답 직전:',
      JSON.stringify(
        {
          ...successType,
          ...data,
        },
        null,
        2,
      ),
    );
    reply.status(successType.status).send({
      ...successType,
      ...data,
    });
  };

  return {
    handleError,
    handleSuccess,
  };
};

export default handlerUtil();
