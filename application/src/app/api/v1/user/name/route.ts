import { getAuth } from "@app/server/auth/authenticatorFactory";
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

    const user = await getAuth().getUser(req);
    const userRepository = new NextUserRepository();

    user.updateName(firstName, lastName);
    await userRepository.save(user);

    logger.info(
      `[User][${user.id}][Updated] - Updated name to ${user.name} by ${user.id}`,
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
