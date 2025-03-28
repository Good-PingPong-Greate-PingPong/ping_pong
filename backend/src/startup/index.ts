import { connectPrisma } from './prisma';

export async function init() {
  // 데이터베이스 연결, 초기 설정 등 실행
  await connectPrisma();
  // 다른 초기화 작업 추가 가능
}
