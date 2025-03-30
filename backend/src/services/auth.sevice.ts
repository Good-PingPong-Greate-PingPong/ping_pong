import { prisma } from '../plugins/prisma';

export async function getGoogleUser(accessToken: string) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error('Google user fetch failed');
  return await res.json();
}

export async function handleGoogleUser(googleUser: any) {
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
