import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const algorithm = "aes-256-cbc";
const iv = randomBytes(16);

export function encrypt(text: string): string {
  const cipher = createCipheriv(
    algorithm,
    Buffer.from(process.env.ENCRYPTION_SECRET!),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(":");
  const decipher = createDecipheriv(
    algorithm,
    Buffer.from(process.env.ENCRYPTION_SECRET!),
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(Buffer.from(encryptedHex, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
