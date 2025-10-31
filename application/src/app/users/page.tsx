"use server";
import { User } from "@domain/user";
import { ACTIVE_USER_ID } from "application/src/constants";
import NextUserRepository from "application/src/core/repositories/NextUserRepository";
import { objectToUser } from "application/src/lib/mappers/user";
import { getAllUsers, getPedingUserRequests } from "../actions/usersActions";
import { UserComponent } from "./UserComponent";
import { UserInviteForm } from "./UserInviteForm";
import { UserRequestComponent } from "./UserRequestComponent";
import { UserRequestPendingComponent } from "./UserRequestPendingComponent";

const repository = new NextUserRepository();

export default async function UsersManagePage() {
  const activeUser = await repository.findById(ACTIVE_USER_ID);

  if (activeUser?.role !== "ADMINISTRATOR")
    return <div>Missing privileges</div>;

  const pendingRequests = await getPedingUserRequests();
  const users = (await getAllUsers()).map(objectToUser);
  return (
    <div className="min-h-dvh flex flex-col items-center">
      <div className="my-4 px-4 flex w-full justify-between">
        <div className="flex gap-1">
          <div>Back</div>
          <h1>Application Users</h1>
        </div>
        <div>More</div>
      </div>
      <div className="flex flex-col gap-2">
        <UserRequestPendingComponent requests={pendingRequests} />
        <section>
          <h2 className="text-xl my-2">All users</h2>
          <div className="flex flex-col gap-1">
            {users.map((user) => (
              <UserComponent user={user} key={user.id} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl my-2">Invite new</h2>
          <UserInviteForm />
        </section>
      </div>
    </div>
  );
}
