"use server";

import {
  getAllActiveUsers,
  getPedingUserRequests,
} from "@app/features/users/actions";
import UsersManageClient from "@app/features/users/components/UsersManageClient";
import { UserPageHeader } from "@app/features/users/components/UsersPageHeader";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";

import { MissingPrivileges } from "@app/ui/error-pages/MissingPrivileges";
import { PageWrapper } from "@app/ui/layout/PageWrapper";

export default async function UsersManagePage() {
  const activeUser = await getAuthenticatedUserFromCookie();

  if (activeUser?.role !== "ADMINISTRATOR")
    return (
      <PageWrapper>
        <UserPageHeader />
        <MissingPrivileges />
      </PageWrapper>
    );

  const pendingRequests = await getPedingUserRequests();
  const users = await getAllActiveUsers();
  return <UsersManageClient users={users} pendingRequests={pendingRequests} />;
}
