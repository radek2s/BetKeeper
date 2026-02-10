import { ServerEventStream } from "@app/server/events/ServerSideEventDispatcher";
import type { NextRequest } from "next/server";

/**
 * Register for Server Side Events
 * @ignore
 */
export async function GET(req: NextRequest) {
  const watcherId = req.nextUrl.searchParams.get("wid");

  if (!watcherId)
    return Response.json(
      {
        error: "Invalid form data",
        message: "Missing required wid query parameter",
      },
      { status: 400 },
    );

  const stream = ServerEventStream.subscribe(watcherId);

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Conntection: "keep-alive",
    },
  });
}
