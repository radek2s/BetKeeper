import { authorizedUserToUserType } from "@app/features/users/model/userDto";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { redirect } from "next/navigation";
import { Home } from "./Home";

export default async function Index() {
  const user = await getAuthenticatedUserFromCookie();

  if (!user) redirect("/login");

  return (
    <PageWrapper>
      <Home user={authorizedUserToUserType(user)} />
    </PageWrapper>
  );
}
