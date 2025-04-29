import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { prisma } from '../plugins/prisma';

const twoFAService = () => {
  /**
   * 2FA 설정을 위한 시크릿 키 생성 및 QR코드 반환
   */
  const generate2FASetup = async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nickname: true }, // nickname만 조회
    });

    if (!user) {
      throw new Error('User not found');
    }

    const secret = speakeasy.generateSecret({
      name: `great-ping-pong (${user.nickname})`,
    });

    // QR코드 이미지 (Data URL)
    const qrCode = await qrcode.toDataURL(secret.otpauth_url || '');

    // DB에 시크릿 저장 (아직 활성화는 X)
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });

    return {
      qrCode, // QR코드 이미지 (클라이언트에서 이미지 태그의 src로 렌더링 가능)
      secret: secret.base32, // 예비용
    };
  };

  /**
   * 사용자가 입력한 2FA 코드 검증
   */
  const verify2FACode = async (userId: number, inputCode: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorSecret) return false;

    const isVerified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: inputCode,
      window: 1,
    });

    return isVerified;
  };

  const findUserById = async (userId: number) => {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  };

  /**
   * 2FA 비활성화
   */
  const reset2FA = async (id: number) => {
    return prisma.user.update({
      where: { id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });
  };
  return {
    generate2FASetup,
    verify2FACode,
    reset2FA,
    findUserById,
  };
};

export default twoFAService();
