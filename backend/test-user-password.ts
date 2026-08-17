import bcrypt from "bcryptjs";
import prisma from "./src/config/prisma.js";

const email = "admin@streamys.in";
const newPassword = "Streamys@12345";

async function resetPassword() {
  const hash = await bcrypt.hash(newPassword, 10);

  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: hash,
    },
  });

  console.log("User:", user.email);
  console.log("Hash length:", user.password.length);
  console.log("Hash prefix:", user.password.substring(0, 7));

  const verified = await bcrypt.compare(
    newPassword,
    user.password
  );

  console.log("Password verification:", verified);

  await prisma.$disconnect();
}

resetPassword().catch(async (error) => {
  console.error("Reset failed:", error);
  await prisma.$disconnect();
  process.exit(1);
});