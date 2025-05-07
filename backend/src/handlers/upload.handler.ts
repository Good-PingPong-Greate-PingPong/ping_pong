import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { config } from '../config';
import { ERROR_MESSAGE } from '../lib';

const pump = promisify(pipeline);

const uploadHandler = () => {
  const uploadProfileImage = async (
    req: FastifyRequest,
    reply: FastifyReply,
  ) => {
    if (!req.isMultipart()) {
      return reply.status(ERROR_MESSAGE.badRequest.status).send({
        ...ERROR_MESSAGE.badRequest,
        message: 'multipart/form-data가 아닙니다',
      });
    }

    const parts = req.parts();

    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname === 'profileImage') {
        const fileName = `${Date.now()}-${part.filename}`;
        const filePath = path.join(
          __dirname,
          `../../${config.uploadDir}`,
          fileName,
        );

        await pump(part.file, fs.createWriteStream(filePath));

        const imageUrl = `/${config.uploadDir}/${fileName}`;

        return reply.code(200).send({ url: imageUrl });
      }
    }

    return reply.status(ERROR_MESSAGE.badRequest.status).send({
      ...ERROR_MESSAGE.badRequest,
      message: 'profileImage 파일이 없습니다',
    });
  };

  return {
    uploadProfileImage,
  };
};

export default uploadHandler();
