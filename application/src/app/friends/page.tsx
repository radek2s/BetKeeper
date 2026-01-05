"use server";
import { FriendInvite } from "@app/features/friends/components/FriendInvite";

import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { Friends } from "./Friends";

export default async function FriendsPage() {
  return (
    <PageWrapper>
      <PageHeader title="Friends" returnUrl="/" />
      <Friends />
      <FriendInvite />
    </PageWrapper>
  );
}
