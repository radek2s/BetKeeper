import { Panel } from "@app/ui/layout/Panel";
import type { TabName } from "./types";

interface Props {
  tabName: TabName;
}
function BetEmptyList({ tabName }: Props) {
  const getMessage = () => {
    switch (tabName) {
      case "requests":
        return (
          <p>
            Seems that there are no pending requests. <br />
            Maybe you want to{" "}
            <strong className="text-primary-500">create a new one?</strong>
          </p>
        );
      case "pending":
        return <p>All bets are resolved.</p>;
      case "resolved":
        return <p>All bets are completed.</p>;
      case "completed":
        return (
          <p>
            There are no finished bets.
            <br />
            Try to complete first one!
          </p>
        );
    }
  };

  return <Panel className="text-center">{getMessage()}</Panel>;
}

export default BetEmptyList;
