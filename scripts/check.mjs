import bcrypt from "bcryptjs";

const password = process.argv[2];
const hash = process.argv[3];

const valid = await bcrypt.compare(password, hash);

console.log(valid ? "valid password" : "invalid password");