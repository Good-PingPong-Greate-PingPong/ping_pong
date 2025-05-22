import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { config } from '../config';

const pump = promisify(pipeline);

const uploadService = () => {
  /**
   * 프로필 이미지를 저장하고, 저장된 이미지의 URL을 반환
   */
  const saveProfileImage = async (
    fileStream: NodeJS.ReadableStream,
    originalFilename: string,
  ): Promise<string> => {
    const fileName = `${Date.now()}-${originalFilename}`;
    const filePath = path.join(
      __dirname,
      `../../${config.uploadDir}`,
      fileName,
    );

    await pump(fileStream, fs.createWriteStream(filePath));

    return `/${config.uploadDir}/${fileName}`;
  };

  return {
    saveProfileImage,
  };
};

export default uploadService();
