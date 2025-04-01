import bcrypt from "bcrypt"
const hash = bcrypt.hashSync("3f7jer03", 10);
console.log(hash);
