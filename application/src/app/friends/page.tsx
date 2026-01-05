"use server";
import { FriendInvite } from "@app/features/friends/components/FriendInvite";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { Friends } from "./Friends";

export default async function FriendsPage() {
  const user = await getAuthenticatedUserFromCookie();
  if (!user) return <div>User is not logged in!</div>;

  return (
    <PageWrapper>
      <PageHeader title="Friends" returnUrl="/" />
      <Friends />
      <FriendInvite />
    </PageWrapper>
  );
}
