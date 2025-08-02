import * as bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // bcrypt salt rounds
  return bcrypt.hash(password, saltRounds);
};
