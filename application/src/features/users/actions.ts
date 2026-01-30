"use server";

import NextUserRepository from "@app/server/repositories/NextUserRepository";

// export async function toggleUserStatus(
//   userId: string,
//   token: string | undefined,
// ) {
//   const requestingUser = await validateToken(token);

//   try {
//     const user = await userRepository.findById(userId);
//     if (!user) throw new Error("User with id not found!");
//     if (user.isActive()) {
//       user.deactivate();
//       logger.info(`[User][${userId}][Deactivated] by ${requestingUser.id}`);
//     } else {
//       user.activate();
//       logger.info(`[User][${userId}][Activated] by ${requestingUser.id}`);
//     }
//     await userRepository.save(user);
//     revalidatePath(`/users`);
//   } catch (e) {
//     logger.error(e);
//   }
// }

// export async function suspendUser(userId: string, token: string | undefined) {
//   const requestingUser = await validateToken(token);

//   try {
//     const user = await userRepository.findById(userId);
//     if (!user) throw new Error("User with id not found!");
//     user.suspend();
//     await userRepository.save(user);
//     logger.info(`[User][${userId}][Suspended] by ${requestingUser.id}`);
//     revalidatePath(`/users`);
//   } catch (e) {
//     logger.error(e);
//   }
// }

export async function getUserDetails(userId: string) {
  const user = await new NextUserRepository().findById(userId);
  if (!user) throw new Error("User not found");
  return user;
}
