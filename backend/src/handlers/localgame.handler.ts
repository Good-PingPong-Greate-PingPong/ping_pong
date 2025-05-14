import { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../lib/constants';
import { handlerUtil } from '../lib';

import { CreateLocalGameRequest } from '../schema/type'; //check
import localGameService from '../services/localgame.service';

const localGameHandler = () => {
  //schema에서 req의 body를 강제하는데, 핸들러에서 다시 타입을 지정해야 하는 이유가 있는지?
  const createLocalGame = async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      await localGameService.createLocalGame(req.body, req.user.userId);
      rep
        .status(SUCCESS_MESSAGE.registerOK.status)
        .send(SUCCESS_MESSAGE.registerOK);
    } catch (error) {
      handlerUtil.handleError(rep, ERROR_MESSAGE.badRequest, error);
    }
  };

  return {
    createLocalGame,
  };
};

export default localGameHandler();
