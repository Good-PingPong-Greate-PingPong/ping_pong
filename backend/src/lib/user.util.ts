import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { Multipart } from '@fastify/multipart';
import { config } from '../config';
import { fileURLToPath } from 'url';
import { UpdateUserProfileRequest } from '../schema/type';

const pump = promisify(pipeline);

const userUtil = () => {
  const getDirname = (metaUrl: string): string => {
    return path.dirname(fileURLToPath(metaUrl));
  };

  const saveProfileImage = async (
    fileStream: NodeJS.ReadableStream,
    originalFilename: string,
  ): Promise<string> => {
    const __dirname = getDirname(import.meta.url);
    const fileName = `${Date.now()}-${originalFilename}`;
    const filePath = path.join(
      __dirname,
      `../../${config.uploadDir}`,
      fileName,
    );
    await pump(fileStream, fs.createWriteStream(filePath));
    return `/${config.uploadDir}/${fileName}`;
  };

  const parseUserProfileParts = async (
    parts: AsyncIterable<Multipart>,
  ): Promise<UpdateUserProfileRequest> => {
    const updateData: UpdateUserProfileRequest = {};

    for await (const part of parts) {
      if (part.type === 'file' && part.fieldname.trim() === 'profileImage') {
        const validTypes = ['image/jpeg', 'image/png'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!validTypes.includes(part.mimetype)) {
          throw new Error(`지원하지 않는 이미지 타입입니다: ${part.mimetype}`);
        }

        if (part.file.truncated || part.file.readableLength > maxSize) {
          throw new Error('파일 크기가 너무 큽니다 (최대 2MB)');
        }

        const imageUrl = await saveProfileImage(part.file, part.filename);
        updateData.profileImage = imageUrl;
      } else if (part.type === 'field') {
        const { fieldname, value } = part;

        if (typeof value !== 'string') {
          throw new Error(
            `Invalid value type for field "${fieldname}": expected string`,
          );
        }

        switch (fieldname) {
          case 'nickname': {
            const trimmed = value.trim();
            if (!trimmed || trimmed.length < 2 || trimmed.length > 16) {
              throw new Error(
                '닉네임은 2~16자의 공백이 아닌 문자열이어야 합니다',
              );
            }
            updateData.nickname = trimmed;
            break;
          }
          case 'twoFactorEnabled':
            updateData.twoFactorEnabled = value === 'true';
            break;
          default:
            throw new Error(`Unknown field: "${fieldname}"`);
        }
      }
    }
    return updateData;
  };
  return {
    saveProfileImage,
    parseUserProfileParts,
    getDirname,
  };
};

export default userUtil();
