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

  const getUserProfile = async (userId: number) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        email: true,
        profileImage: true,
        twoFactorEnabled: true,
      },
    });
  };

  const getUsersProfileList = async (
    requesterId: number,
    nickname: string,
    page: number,
    pageSize: number,
  ) => {
    const where = {
      nickname: { contains: nickname, mode: 'insensitive' },
      NOT: { id: requesterId },
    };

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          nickname: true,
          profileImage: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    const totalPage = Math.ceil(totalCount / pageSize);

    const friends = await prisma.friend.findMany({
      where: {
        senderId: requesterId,
        receiverId: { in: users.map((u) => u.id) },
      },
      select: { receiverId: true },
    });

    const friendSet = new Set(friends.map((f) => f.receiverId));

    const userList = users.map((user) => ({
      id: user.id,
      nickname: user.nickname,
      profile_image: user.profileImage,
      isFriend: friendSet.has(user.id),
      isLogin: isUserOnline(user.id),
    }));

    return {
      total_page: totalPage,
      current_page: page,
      users: userList,
    };
  };

  return {
    updateUserProfileInfo,
    getUserProfile,
    getUsersProfileList,
  };
};

export default userService();
