import { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../lib/constants';
import { handlerUtil } from '../lib';
import localGameService from '../services/localgame.service';

const localGameHandler = () => {
  const createLocalGame = async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      await localGameService.createLocalGame(req.body, req.user.userId); // req.body에서 오류발생
      handlerUtil.handleSuccess(rep, SUCCESS_MESSAGE.registerOK);
    } catch (error) {
      handlerUtil.handleError(rep, ERROR_MESSAGE.badRequest, error);
    }
  };

  return {
    createLocalGame,
  };
};

export default localGameHandler();
