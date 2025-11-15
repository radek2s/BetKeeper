"use client";
import { UserComponent } from "@app/features/users/components/UserComponent";
import { UserInviteForm } from "@app/features/users/components/UserInviteForm";
import { UserRequestPendingComponent } from "@app/features/users/components/UserRequestPendingComponent";
import type { UserRequestWithRequester } from "@app/lib/mappers/user";

import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { Panel } from "@app/ui/layout/Panel";
import type { UserType } from "@domain/user/entities";
import { UserPageHeader } from "./UsersPageHeader";

interface Props {
  pendingRequests: UserRequestWithRequester[];
  users: UserType[];
}
export default function UsersManageClient({ pendingRequests, users }: Props) {
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
