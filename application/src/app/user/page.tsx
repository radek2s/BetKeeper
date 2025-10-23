import { PrismaClient } from "../../../generated/prisma";
import { UserCreateForm } from "./createForm";
import { UserRequestCreateForm } from "./requestForm";

const prisma = new PrismaClient();

export default async function Users() {
  const allUsers = await prisma.userRequestTable.findMany();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {allUsers.map((user) => (
          <li key={user.id}>
            {user.inviteeEmail} {user.status}
          </li>
        ))}
      </ul>

      <UserCreateForm />
      <UserRequestCreateForm />
    </div>
  );
}
