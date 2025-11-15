"use server";

import {
  getActiveUser,
  getAllActiveUsers,
  getPedingUserRequests,
} from "@app/features/users/actions";

import { MissingPrivileges } from "@app/ui/error-pages/MissingPrivileges";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import UsersManageClient from "./UsersManageClient";
import { UserPageHeader } from "./UsersPageHeader";

export default async function UsersManagePage() {
  const activeUser = await getActiveUser();

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
