"use server";

import NextUserRepository from "@app/server/repositories/NextUserRepository";

// export async function approveUserRequest(
//   requestId: UUID,
//   firstName: string,
//   lastName: string,
//   token: string | undefined,
// ) {
//   const requestingUser = await validateToken(token);

//   try {
//     const user = await NextUserInvitationService.approveUserRequest(
//       requestId,
//       requestingUser.id,
//       firstName,
//       lastName,
//     );

//     const providerId = await createCorbadoUser(
//       user.email.value,
//       `${firstName} ${lastName}`,
//     );
//     await new NextUserRepository().attachProviderId(user.id, providerId);
//     logger.info(
//       `[User Request][${requestId}][Approved] - by ${requestingUser.id}`,
//     );

//     // biome-ignore lint/style/noNonNullAssertion: Request must exist because was previously approved.
//     const request = (await new NextUserRequestRepository().findById(
//       requestId,
//     ))!;
//     await NextUserService.sendFriendRequest(
//       request.requesterId,
//       request.inviteeEmail,
//     );

//     //Approved and created user -> so send invitation to friend
//     revalidatePath(`/users`);
//   } catch (e) {
//     logger.error(e);
//     throw e;
//   }
// }

// export async function rejectUserRequest(
//   requestId: UUID,
//   token: string | undefined,
// ) {
//   const user = await validateToken(token);

//   try {
//     await NextUserInvitationService.rejectInvitationRequest(requestId);
//     logger.info(`[User Request][${requestId}][Rejected] by ${user.id}`);
//     revalidatePath(`/users`);
//   } catch (e) {
//     logger.error(e);
//     throw e;
//   }
// }

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

// async function createCorbadoUser(userEmail: string, fullName: string) {
//   const res = await fetch(
//     `${await getBackendApi()}/v2/users`,
//     getRequestInt(await getAuthHeader(), getUserRequest(fullName)),
//   );
//   const { userID } = await res.json();

//   await fetch(
//     `${await getBackendApi()}/v2/users/${userID}/identifiers`,
//     getRequestInt(await getAuthHeader(), getIdentifierRequest(userEmail)),
//   );

//   return userID;
// }

export async function getUserDetails(userId: string) {
  const user = await new NextUserRepository().findById(userId);
  if (!user) throw new Error("User not found");
  return user;
}
