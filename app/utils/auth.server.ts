import { hash, verify } from "argon2";
import crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
  return await hash(password);
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return await verify(hash, password);
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 1); // 1 hour expiry
  return expiry;
}
