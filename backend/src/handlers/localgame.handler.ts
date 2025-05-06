import { FastifyReply, FastifyRequest } from "fastify"
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../lib/constants"
import {handleError} from "../lib/error.handler"

import { CreateLocalGameRequest } from "../schema/types"
import localGameService from "../services/localgame.service"

const localGameHandler = () => {
    const createLocalGame = async (
        req: FastifyRequest<{Body: CreateLocalGameRequest}>,
        rep: FastifyReply
    ) => {
        try {
            await localGameService.createLocalGame(req.body, req.user.userId);
            rep
                .status(SUCCESS_MESSAGE.registerOK.status)
                .send(SUCCESS_MESSAGE.registerOK);
        } catch (error) {
            handleError(rep, ERROR_MESSAGE.badRequest, error);
        }
    };

    return {
        createLocalGame
    };
};

export default localGameHandler();