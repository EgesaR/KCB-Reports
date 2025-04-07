import { prisma } from "~/utils/prisma.server";
import type { User } from "~/types/blog";

interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
  expiryDate: number | null;
}

export async function storeGoogleTokens(
  userId: string,
  tokens: GoogleTokens
): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      googleAccessToken: tokens.accessToken,
      googleRefreshToken: tokens.refreshToken,
      roles: { set: ["USER"] }, // Ensure roles are set
    },
    include: {
      roles: true,
    },
  }) as Promise<User>;
}

export async function createResetToken(email: string): Promise<string | null> {
  const user = await prisma.user.update({
    where: { email },
    data: {
      resetToken: Math.random().toString(36).slice(2),
      resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour
    },
  });
  return user?.resetToken || null;
}

export async function validateResetToken(token: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
    include: {
      roles: true,
    },
  }) as Promise<User | null>;
}
