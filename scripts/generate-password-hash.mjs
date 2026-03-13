import bcrypt from "bcryptjs";

const pwd = process.argv[2];

if (!pwd) {
  console.error("Usage: pnpm generate-hash <password>");
  process.exit(1);
}

try {
  const hash = await bcrypt.hash(pwd, 10);
  console.log(hash);
} catch (err) {
  console.error("Failed to generate hash:", err instanceof Error ? err.message : err);
  process.exit(1);
}

