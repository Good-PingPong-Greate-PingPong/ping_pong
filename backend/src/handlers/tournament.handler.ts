import { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../lib/constants';
import { handlerUtil } from '../lib';
import tournamentService from '../services/tournament.service';
import { ListQueryRoute } from '../schema/type/index';

const tournamentHandler = () => {
  const readTournament = async (
    req: FastifyRequest<ListQueryRoute>,
    rep: FastifyReply,
  ) => {
    try {
      const page = Number(req.query.page);
      const result = await tournamentService.readTournament(
        req.user.userId,
        page,
      );
      handlerUtil.handleSuccess(rep, SUCCESS_MESSAGE.registerOK, result);
    } catch (error) {
      handlerUtil.handleError(rep, ERROR_MESSAGE.badRequest, error);
    }
  };

  return { readTournament };
};

export default tournamentHandler();
