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
import { Panel } from "@app/ui/layout/Panel";
import Link from "next/link";

export default async function UsersManagePage() {
  const activeUser = await getActiveUser();

  if (activeUser?.role !== "ADMINISTRATOR")
    return <div>Missing privileges</div>;

  const pendingRequests = await getPedingUserRequests();
  const users = await getAllActiveUsers();
  return (
    <div className="min-h-dvh flex flex-col items-center">
      <div className="my-4 px-4 flex w-full justify-between">
        <div className="flex gap-2 items-center">
          <Link href={"/profile"}>
            <IconButton icon="chevron-left" />
          </Link>
          <h1 className="text-xl">Users management</h1>
        </div>
        <IconButton icon="more" />
      </div>
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
    </div>
  );
}
