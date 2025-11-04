const { PrismaClient } = require("./application/generated/prisma");

const prisma = new PrismaClient();

async function initE2E() {
  const adminUser = await prisma.userTable.create({
    data: {
      id: "00000000-0000-0000-0000-000011110000",
      email: "john.doe@email.com",
      firstName: "John",
      lastName: "Doe",
      status: "active",
      role: "ADMINISTRATOR",
      avatarUrl: "/avatars/avatar_03.png",
    },
  });
  console.log(adminUser);
}

initE2E()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
