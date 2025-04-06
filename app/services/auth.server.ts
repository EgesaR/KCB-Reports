import { prisma } from "~/utils/prisma.server";
import type { User } from "@prisma/client";

export async function storeGoogleTokens(
  userId: User["id"],
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiryDate: number | null;
  }
) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      googleAccessToken: tokens.accessToken,
      googleRefreshToken: tokens.refreshToken,
      googleTokenExpiry: tokens.expiryDate ? new Date(tokens.expiryDate) : null,
    },
  });
}
