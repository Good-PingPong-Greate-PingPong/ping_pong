import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users: Prisma.UserCreateManyInput[] = [];

  for (let i = 0; i < 80; i++) {
    users.push({
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: '',
      profileImage: faker.image.avatar(),
      twoFactorEnabled: false,
      twoFactorSecret: null,
    });
  }

  await prisma.user.createMany({
    data: users,
  });

  console.log(`✅ ${users.length} users created`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
