import { UserRequest } from "@domain/user";
import type { UserRequestType } from "@domain/user/entities";
import { UserRequestComponent } from "./UserRequestComponent";

interface Props {
  requests: UserRequestType[];
}
export function UserRequestPendingComponent({ requests }: Props) {
  return (
    <section>
      <h2 className="text-xl my-2">Pending requests</h2>
      <div>
        {requests.length === 0 ? (
          <div className="text-gray-500">No pending requets</div>
        ) : (
          <div className="flex flex-col gap-2">
            {requests.map((request) => (
              <UserRequestComponent request={request} key={request.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
