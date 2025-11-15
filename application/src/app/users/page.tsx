"use server";

import {
  getActiveUser,
  getAllActiveUsers,
  getPedingUserRequests,
} from "@app/features/users/actions";
import { UserComponent } from "@app/features/users/components/UserComponent";
import { UserInviteForm } from "@app/features/users/components/UserInviteForm";
import { UserRequestPendingComponent } from "@app/features/users/components/UserRequestPendingComponent";
import { IconButton } from "@app/ui/button/IconButton";
import { MissingPrivileges } from "@app/ui/error-pages/MissingPrivileges";
import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { Panel } from "@app/ui/layout/Panel";

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
  return (
    <PageWrapper>
      <UserPageHeader />
      <div className="flex flex-col gap-2">
        <UserRequestPendingComponent requests={pendingRequests} />
        <Panel header={{ title: "Active accounts", icon: "group" }}>
          <div className="flex flex-col gap-1">
            {users.map((user) => (
              <UserComponent userObject={user} key={user.id} />
            ))}
          </div>
        </Panel>
        <Panel header={{ title: "Invite new", icon: "add" }}>
          <UserInviteForm />
        </Panel>
      </div>
    </PageWrapper>
  );
}

function UserPageHeader() {
  return (
    <PageHeader title="Users management" returnUrl="/profile">
      <IconButton icon="more" />
    </PageHeader>
  );
}
