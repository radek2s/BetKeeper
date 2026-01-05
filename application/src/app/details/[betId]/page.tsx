"use server";

import { authorizedUserToUserType } from "@app/features/users/model/userDto";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import BetDetails from "./BetDetails";

interface PageProps {
  params: Promise<{ betId: string }>;
}
export default async function BetDetailsPage({ params }: PageProps) {
  const user = await getAuthenticatedUserFromCookie();
  const { betId } = await params;

  if (!user) return <div>User not logged in!</div>;

  return (
    <BetDetails betId={betId} activeUser={authorizedUserToUserType(user)} />
  );
}
