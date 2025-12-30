import type { BetStatus } from "@domain/bet";
import clsx from "clsx";

interface Props {
  status: BetStatus;
}
export function BetStatusComponent({ status }: Props) {
  return (
    <div
      className={clsx([
        "py-1 px-4 rounded-xl bet-request-status",
        status.toLowerCase(),
      ])}>
      {status}
    </div>
  );
}
