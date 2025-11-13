"use server";

import { IconButton } from "application/src/lib/components/button/IconButton";
import Link from "next/link";
import {
  getActiveUser,
  getAllActiveUsers,
  getPedingUserRequests,
} from "../actions/usersActions";
import { UserComponent } from "./UserComponent";
import { UserInviteForm } from "./UserInviteForm";
import { UserRequestPendingComponent } from "./UserRequestPendingComponent";

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
        <section className="panel">
          <h2 className="my-2">Active accounts</h2>
          <div className="flex flex-col gap-1">
            {users.map((user) => (
              <UserComponent userObject={user} key={user.id} />
            ))}
          </div>
        </section>
        <section className="panel">
          <h2 className="my-2">Invite new</h2>
          <UserInviteForm />
        </section>
      </div>
    </div>
  );
}
