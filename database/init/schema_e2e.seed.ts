import { prisma } from "../../application/src/prisma";

async function initE2E() {
  const adminUser = await prisma.userTable.create({
    data: {
      id: "00000000-0000-0000-0000-000011110000",
      providerId: "EXTERNAL_USER_ID",
      email: "john.doe@email.com",
      firstName: "John",
      lastName: "Doe",
      status: "active",
      role: "ADMINISTRATOR",
      avatarUrl: "/avatars/avatar_02.png",
    },
  });
  console.log(adminUser);

  const adminsFriend = await prisma.userTable.create({
    data: {
      id: "00000000-0000-0000-0000-000011110001",
      providerId: "EXTERNAL_USER_FRIEND_ID",
      email: "catrine.smith@email.com",
      firstName: "Catrine",
      lastName: "Smith",
      status: "active",
      role: null,
      avatarUrl: "/avatars/avatar_03.png",
    },
  });
  console.log(adminsFriend);

  const makeFriend = await prisma.friendRequestTable.create({
    data: {
      id: "1",
      createdAt: "2025-01-01T12:00:00.000Z",
      reciverId: "00000000-0000-0000-0000-000011110001",
      senderId: "00000000-0000-0000-0000-000011110000",
      status: "approved",
    },
  });
  console.log(makeFriend);
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
