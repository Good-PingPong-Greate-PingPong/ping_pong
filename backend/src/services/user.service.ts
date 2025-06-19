import { Prisma } from '@prisma/client';
import { prisma } from '../plugins/prisma';
import { UpdateUserProfileRequest } from '../schema/type';

const userService = () => {
  const updateUserProfileInfo = async (
    userId: number,
    updateFields: UpdateUserProfileRequest,
  ) => {
    const updateData: Partial<Prisma.UserUpdateInput> = {
      ...updateFields,
    };

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    return prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        nickname: true,
        email: true,
        profileImage: true,
        twoFactorEnabled: true,
      },
    });
  };

  return {
    updateUserProfileInfo,
  };
};

export default userService();
