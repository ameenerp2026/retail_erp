import bcrypt from "bcryptjs";
import prisma from "./src/config/prisma.js";

const email = "employee@example.com";
const password = "Welcom@Streamys12345";

const hashedPassword = await bcrypt.hash(password, 10);

await prisma.user.update({
  where: { email },
  data: {
    password: hashedPassword,
  },
});

console.log("Password converted to bcrypt hash successfully");

await prisma.$disconnect();