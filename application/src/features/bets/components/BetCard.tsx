/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useAltText: <explanation> */
import { toRelativeTime } from "@app/lib/utils/timeUtils";
import { Panel } from "@app/ui/layout/Panel";
import Link from "next/link";
import type { BetSummary } from "../model/betDto";

interface Props {
  bet: BetSummary;
}
export function BetCard({ bet }: Props) {
  return (
    <Panel className="bet-card">
      <Link
        href={`/details/${bet.id}`}
        className="w-full text-left flex flex-col gap-1 pt-1">
        <header className="flex items-center">
          <div className="bet-card__avatars">
            {bet.participants.map((participant) => (
              <img
                key={participant.userId}
                className="w-[32px] avatar"
                src={participant.avatarUrl}
              />
            ))}
          </div>
          <div className="text-xl font-medium">{bet.title}</div>
        </header>
        <div className="text-sm">{bet.terms}</div>
        <footer className="text-xs text-right text-gray">
          Created {toRelativeTime(bet.createdAt).join(" ")} ago
        </footer>
      </Link>
    </Panel>
  );
}
