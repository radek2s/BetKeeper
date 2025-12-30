import type { BetStatus } from "@domain/bet";
import clsx from "clsx";

interface Props {
  status: BetStatus;
}
export function BetStatusComponent({ status }: Props) {
  const getStatus = () => {
    switch (status) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "resolved":
        return "Resolved";
      case "deleted":
        return "Deleted";
    }
  };
  return (
    <div
      className={clsx([
        "py-1 px-4 rounded-xl bet-request-status",
        status.toLowerCase(),
      ])}>
      {getStatus()}
    </div>
  );
}
