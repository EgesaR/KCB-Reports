import { atom } from "nanostores";
import CryptoJS from "crypto-js";

// Define nanostore for user data
export const userStore = atom<any | null>(null);

// Decrypt and set user data
export function setEncryptedUserData(encryptedData: string) {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      encryptedData,
      process.env.REACT_APP_ENCRYPTION_SECRET!
    ).toString(CryptoJS.enc.Utf8);

    const userData = JSON.parse(decrypted);
    userStore.set(userData);
  } catch (error) {
    console.error("Failed to decrypt user data:", error);
    userStore.set(null);
  }
}

// Clear user data for logout
export function clearUserData() {
  userStore.set(null);
}
