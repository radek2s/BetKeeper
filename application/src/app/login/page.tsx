import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import { redirect } from "next/navigation";
import { Login } from "./Login";

export default async function LoginPage() {
  const user = await getAuthenticatedUserFromCookie();
  if (user) {
    redirect("/profile");
  }
  return <Login />;
}
