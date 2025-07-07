import { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../lib/constants';
import { handlerUtil } from '../lib';
import localGameService from '../services/localgame.service';
import { CreateLocalGameRoute, ListQueryRoute } from '../schema/type/index';

const localGameHandler = () => {
  const createLocalGame = async (
    req: FastifyRequest<CreateLocalGameRoute>,
    rep: FastifyReply,
  ) => {
    try {
      await localGameService.createLocalGame(req.body, req.user.userId); // req.body에서 오류발생
      handlerUtil.handleSuccess(rep, SUCCESS_MESSAGE.registerOK);
    } catch (error) {
      handlerUtil.handleError(rep, ERROR_MESSAGE.badRequest, error);
    }
  };

  const readLocalGame = async (
    req: FastifyRequest<ListQueryRoute>,
    rep: FastifyReply,
  ) => {
    try {
      const page = Number(req.query.page);
      const offset = Number(req.query.offset);
      const result = await localGameService.readLocalGame(
        req.user.userId,
        page,
        offset,
      );
// handlerUtil.handleSuccess(rep, SUCCESS_MESSAGE.registerOK, result);

      return rep.send({
        success: true,
        status: 200,
        message: 'get localgame results success!',
        data: {
          totalPage: result.totalPage, // camelCase로 수정
          currentPage: result.currentPage, // camelCase로 수정
          records: result.records, // 배열
        },
      });
    } catch (error) {
      handlerUtil.handleError(rep, ERROR_MESSAGE.badRequest, error);
    }
  };

  return {
    createLocalGame,
    readLocalGame,
  };
};

export default localGameHandler();
