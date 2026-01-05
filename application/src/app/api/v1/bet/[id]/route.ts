import { getBet } from "@app/features/bets/actions";
import {
  getAuthenticatedUserFromCookie,
  validateToken,
} from "@app/server/auth/authentication";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    console.log({ id });
    getAuthenticatedUserFromCookie();
    const bet = await getBet(id);
    return NextResponse.json(bet);
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
