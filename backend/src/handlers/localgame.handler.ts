import { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../lib/constants';
import { handlerUtil } from '../lib';
import localGameService from '../services/localgame.service';

const localGameHandler = () => {
  const createLocalGame = async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      await localGameService.createLocalGame(req.body, req.user.userId);
      handlerUtil.handleSuccess(rep, SUCCESS_MESSAGE.registerOK);
    } catch (error) {
      handlerUtil.handleError(rep, ERROR_MESSAGE.badRequest, error);
    }
  };

  type listQuery = {
    page: number,
    offset: number
  };

  const readLocalGame = async (req: FastifyRequest<{Querystring: listQuery}>, rep: FastifyReply) => {
    try {
      const page = Number(req.query.page);
      const offset = Number(req.query.offset);
      const result = await localGameService.readLocalGame(req.user.userId, page, offset);
      handlerUtil.handleSuccess(rep, SUCCESS_MESSAGE.registerOK, result);
    } catch(error) {
      handlerUtil.handleError(rep, ERROR_MESSAGE.badRequest, error);
    }
  }

  return {
    createLocalGame,
    readLocalGame
  };
};

export default localGameHandler();
