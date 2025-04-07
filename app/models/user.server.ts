import { prisma } from "~/utils/prisma.server";
import { hashPassword } from "~/utils/auth.server";
import crypto from "crypto";

interface User {
  id: string;
  email: string;
  passwordHash: string;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
}

export async function createResetToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 3600000); // 1 hour expiry

  return prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });
}

export async function validateResetToken(token: string) {
  return prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  });
}

export async function updatePassword(userId: string, newPassword: string) {
  const passwordHash = await hashPassword(newPassword);

  return prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });
}
