/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useAltText: <explanation> */

import { useUserContext } from "@app/features/users/UserProvider";
import { toRelativeTime } from "@app/lib/utils/timeUtils";
import { Icon } from "@app/ui/icon";
import { Panel } from "@app/ui/layout/Panel";
import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  type BetParticipantResponse,
  type BetResponse,
  type BetResponseType,
  isBetResponse,
} from "../model/betDto";
import { RequestStatus } from "./details/request/BetRequestDetails";

interface Props {
  bet: BetResponseType;
}
export function BetCard({ bet }: Props) {
  const isBet = isBetResponse(bet);
  const { id } = useUserContext();
  const betRequestStatus = (): ReactNode => {
    if (isBet) return null;
    return <RequestStatus variant="small" participants={bet.participants} />;
  };
  return (
    <Panel className="bet-card">
      <Link
        href={`/details/${bet.id}`}
        className="w-full text-left flex flex-col gap-1 pt-1">
        <header className="flex items-center">
          <ParticipantAvatars
            winnerId={(bet as BetResponse)?.winnerId}
            creatorId={bet.creatorId}
            participants={bet.participants}
          />
          <div>{betRequestStatus()}</div>
          <BetCardCreated createdAt={bet.createdAt} />
        </header>
        <div className="text-sm mt-1">{bet.terms}</div>
        <footer className="text-xs text-right text-gray">
          Updated {toRelativeTime(new Date(bet.updatedAt)).join(" ")} ago
        </footer>
      </Link>
    </Panel>
  );
}

interface ParticipantAvatarsProps {
  creatorId: string;
  winnerId?: string;
  participants: BetParticipantResponse[];
}
function ParticipantAvatars({
  creatorId,
  winnerId,
  participants,
}: ParticipantAvatarsProps) {
  const sortedParticipants = participants.sort((a, b) => {
    if (a.userId === creatorId) return -1;
    if (b.userId === creatorId) return 1;
    return a.userId.localeCompare(b.userId);
  });

  return (
    <div className="bet-card__avatars">
      {sortedParticipants.map((participant) => (
        <div
          key={participant.userId}
          className={clsx([
            "avatar_wrapper",
            { winner: winnerId === participant.userId },
          ])}>
          <img
            title={`${participant.firstName} ${participant.lastName}`}
            className={clsx(["w-[32px] avatar", participant.vote])}
            src={participant.avatarUrl || "/avatars/avatar_00.png"}
          />
          {winnerId === participant.userId && (
            <img className={clsx(["avatar_laurel"])} src={"/laurel.png"} />
          )}
        </div>
      ))}
    </div>
  );
}

interface BetCardCreatedProps {
  createdAt: string;
}
function BetCardCreated({ createdAt }: BetCardCreatedProps) {
  return (
    <div className="flex gap-1 justify-end items-center text-gray grow text-xs bet-card__created">
      <span>Created {toRelativeTime(new Date(createdAt)).join(" ")} ago</span>
      <Icon name="calendar" />
    </div>
  );
}

interface BetWinnerStatusProps {
  userId: string;
  winnerId: string | undefined;
}
function BetWinnerStatus({ userId, winnerId }: BetWinnerStatusProps) {
  const isWinner = userId === winnerId;

  if (!winnerId) return null;

  return isWinner ? <Icon name="trophy" className="icon-primary" /> : null;
}
