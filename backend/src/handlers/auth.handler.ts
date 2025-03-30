import { getGoogleUser, handleGoogleUser } from '../services';
import { SUCCESS_MESSAGE, ERROR_MESSAGE, signAccessToken } from '../lib';
import { FastifyRequest, FastifyReply } from 'fastify';

export async function googleCallbackHandler(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const token =
      await req.server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
        req,
      );
    const { access_token } = token.token as any;

    const googleUser = await getGoogleUser(access_token);
    const user = await handleGoogleUser(googleUser);
    const accessToken = signAccessToken({ userId: user.id });

    reply.code(SUCCESS_MESSAGE.loginOK.status).send({
      ...SUCCESS_MESSAGE.loginOK,
      accessToken,
      user,
    });
  } catch (err) {
    req.log.error(err);
    reply
      .code(ERROR_MESSAGE.serverError.status)
      .send(ERROR_MESSAGE.serverError);
  }
}
