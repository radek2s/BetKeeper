import {
  getAuthenticatedUserFromCookie,
  validateToken,
} from "@app/server/auth/authentication";
import NextUserRepository from "@app/server/repositories/NextUserRepository";
import logger from "application/logger";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName } = body ?? {};

    if (!firstName || !lastName) {
      return new Response(
        JSON.stringify({ error: "firstName and lastName are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const requestingUser = await getAuthenticatedUserFromCookie();
    if (!requestingUser) throw new Error("Not logged");

    const userRepository = new NextUserRepository();
    const user = await userRepository.findById(requestingUser.id);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    user.updateName(firstName, lastName);
    await userRepository.save(user);

    logger.info(
      `[User][${requestingUser.id}][Updated] - Updated name to ${user.name} by ${requestingUser.id}`,
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    logger.error(e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
