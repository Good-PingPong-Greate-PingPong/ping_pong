import { prisma } from '../plugins/prisma';
import { userOnlineUtil } from '../lib';

const friendService = () => {
  const getFriendList = async (
    userId: number,
    page: number,
    pageSize: number,
  ) => {
    const skip = (page - 1) * pageSize;
    const where = {
      senderId: userId,
      isDeleted: false,
    };

    // senderId 기준으로 친구(receiver) 목록 조회
    const [friend, totalCount] = await Promise.all([
      prisma.friend.findMany({
        where,
        skip,
        take: pageSize,
        select: {
          receiver: {
            select: {
              id: true,
              nickname: true,
              profileImage: true,
            },
          },
        },
      }),
      prisma.friend.count({
        where,
      }),
    ]);

    const totalPage = Math.ceil(totalCount / pageSize);

    return {
      total_page: totalPage,
      current_page: page,
      friend: friend.map(({ receiver }) => ({
        id: receiver.id,
        nickname: receiver.nickname,
        profile_image: receiver.profileImage,
      })),
      isLogin: userOnlineUtil.isUserOnline(userId),
    };
  };

  const addFriend = async (senderId: number, nickname: string) => {
    const receiver = await prisma.user.findUnique({
      where: { nickname },
      select: { id: true },
    });
    if (!receiver) {
      throw new Error('존재하지 않는 유저입니다.');
    }
    const receiverId = receiver.id;

    if (senderId === receiverId) {
      throw new Error('자기 자신을 친구로 추가할 수 없습니다.');
    }

    // 이미 팔로우하고 있는지 확인
    const existing = await prisma.friend.findFirst({
      where: {
        senderId,
        receiverId,
        isDeleted: false,
      },
    });

    if (existing) {
      throw new Error('이미 친구입니다.');
    }

    return prisma.friend.create({
      data: {
        senderId,
        receiverId,
      },
    });
  };

  const removeFriend = async (senderId: number, receiverId: number) => {
    const friend = await prisma.friend.findFirst({
      where: {
        senderId,
        receiverId,
        isDeleted: false,
      },
    });

    if (!friend) {
      throw new Error('친구가 아니거나 없는 유저입니다.');
    }

    return prisma.friend.update({
      where: { id: friend.id },
      data: { isDeleted: true },
    });
  };
  return { getFriendList, addFriend, removeFriend };
};

export default friendService();
