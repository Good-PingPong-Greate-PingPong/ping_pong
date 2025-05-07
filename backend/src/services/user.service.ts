import { prisma } from '../plugins/prisma';

const profileService = () => {
  const updateProfileImage = async (userId: number, imageUrl: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        profileImage: imageUrl,
      },
      select: {
        id: true,
        nickname: true,
        profileImage: true,
      },
    });
  };

  return {
    updateProfileImage,
  };
};

export default profileService();
