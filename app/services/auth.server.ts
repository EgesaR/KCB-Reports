import { prisma } from "~/utils/prisma.server";
import { hash } from "bcryptjs";
import type { User, RoleEnum } from "~/types/blog";

function handleError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
  expiryDate?: number | null;
}

export async function storeGoogleTokens(
  userId: string,
  tokens: GoogleTokens
): Promise<User> {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: tokens.accessToken,
        googleRefreshToken: tokens.refreshToken,
        googleTokenExpiry: tokens.expiryDate
          ? new Date(tokens.expiryDate)
          : null,
        roles: {
          connectOrCreate: {
            where: { userId_role: { userId, role: "STUDENT" } },
            create: { role: "STUDENT" },
          },
        },
      },
      include: {
        roles: {
          select: {
            role: true,
          },
        },
      },
    });

    return {
      ...user,
      roles: user.roles.map((r) => r.role as RoleEnum),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      dob: user.dob?.toISOString() ?? null,
      resetTokenExpiry: user.resetTokenExpiry?.toISOString() ?? null,
      googleTokenExpiry: user.googleTokenExpiry?.toISOString() ?? null,
    };
  } catch (error) {
    throw new Error(`Failed to store Google tokens: ${handleError(error)}`);
  }
}

export async function createResetToken(email: string): Promise<string> {
  try {
    const resetToken = Math.random().toString(36).slice(2);

    const user = await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour
      },
    });

    if (!user) throw new Error("User not found");
    return resetToken;
  } catch (error) {
    throw new Error(`Failed to create reset token: ${handleError(error)}`);
  }
}

export async function validateResetToken(token: string): Promise<User> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
      include: {
        roles: {
          select: {
            role: true,
          },
        },
      },
    });

    if (!user) throw new Error("Invalid or expired token");

    return {
      ...user,
      roles: user.roles.map((r) => r.role as RoleEnum),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      dob: user.dob?.toISOString() ?? null,
      resetTokenExpiry: user.resetTokenExpiry?.toISOString() ?? null,
      googleTokenExpiry: user.googleTokenExpiry?.toISOString() ?? null,
    };
  } catch (error) {
    throw new Error(`Token validation failed: ${handleError(error)}`);
  }
}

export async function updatePassword(
  token: string,
  newPassword: string
): Promise<User> {
  try {
    const user = await validateResetToken(token);
    const passwordHash = await hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
      include: {
        roles: {
          select: {
            role: true,
          },
        },
      },
    });

    return {
      ...updatedUser,
      roles: updatedUser.roles.map((r) => r.role as RoleEnum),
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
      dob: updatedUser.dob?.toISOString() ?? null,
      resetTokenExpiry: updatedUser.resetTokenExpiry?.toISOString() ?? null,
      googleTokenExpiry: updatedUser.googleTokenExpiry?.toISOString() ?? null,
    };
  } catch (error) {
    throw new Error(`Password update failed: ${handleError(error)}`);
  }
}
