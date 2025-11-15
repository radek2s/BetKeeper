import { Panel } from "@app/ui/layout/Panel";
import type { UserRequestWithRequester } from "application/src/lib/mappers/user";
import { UserRequestComponent } from "./UserRequestComponent";

interface Props {
  requests: UserRequestWithRequester[];
}
export function UserRequestPendingComponent({ requests }: Props) {
  return (
    <Panel header={{ title: "Pending requests", icon: "waving-hand" }}>
      <div>
        {requests.length === 0 ? (
          <div className="text-gray">No pending requets</div>
        ) : (
          <div className="flex flex-col gap-2">
            {requests.map((request) => (
              <UserRequestComponent request={request} key={request.id} />
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
