import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Login } from "./Login";
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const reqCookies = await cookies();

  const sessionToken = reqCookies.get("cbo_session_token")?.value;
  if (sessionToken) {
    redirect("/");
  }
  return <Login />;
}
