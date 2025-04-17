import { prisma } from '../plugins/prisma';

export async function saveUser(googleUser: any) {
  const { email, name, picture } = googleUser;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        nickname: name || email.split('@')[0],
        profileImage: picture,
        password: '',
      },
    });
  }

  return user;
}

export async function saveRefreshToken(userId: number, token: string) {
  return prisma.refreshToken.create({
    data: {
      userId,
      token,
    },
  });
}

export async function deleteRefreshToken(token: string) {
  return prisma.refreshToken.deleteMany({
    where: { token },
  });
}

export async function findRefreshToken(userId: number, refreshToken: string) {
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
}
