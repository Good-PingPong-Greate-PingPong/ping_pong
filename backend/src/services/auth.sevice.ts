import { prisma } from '../plugins/prisma';

const authService = () => {
  const saveUser = async (googleUser: any) => {
    const { email, name, picture } = googleUser;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const maxLength = 16;
      let rawNickname = (name || email.split('@')[0]).trim();
      let baseNickname = rawNickname.slice(0, maxLength);
      let uniqueNickname = baseNickname;
      let suffix = 1;

      while (
        await prisma.user.findFirst({
          where: { nickname: uniqueNickname },
        })
      ) {
        const suffixStr = `_${suffix}`;
        const trimLength = maxLength - suffixStr.length;
        baseNickname = rawNickname.slice(0, trimLength);
        uniqueNickname = `${baseNickname}${suffixStr}`;
        suffix++;
      }

      user = await prisma.user.create({
        data: {
          email,
          nickname: uniqueNickname,
          profileImage: picture,
          password: '',
        },
      });
    }

    return user;
  };

  const saveRefreshToken = async (userId: number, token: string) => {
    return prisma.refreshToken.upsert({
      where: { userId },
      update: { token },
      create: { userId, token },
    });
  };

  const deleteRefreshToken = async (token: string) => {
    return prisma.refreshToken.deleteMany({
      where: { token },
    });
  };
  const findUserById = async (userId: number) => {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  };
  const findRefreshToken = async (userId: number, refreshToken: string) => {
    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        userId,
        token: refreshToken,
      },
    });

    return {
      userId,
      tokenRecord,
    };
  };

  return {
    saveUser,
    saveRefreshToken,
    deleteRefreshToken,
    findRefreshToken,
    findUserById,
  };
};

export default authService();
