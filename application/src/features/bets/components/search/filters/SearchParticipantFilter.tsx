/** biome-ignore-all lint/performance/noImgElement: <explanation> */
import type { CommonBetParticipantResponse } from "@app/features/bets/model/betDto";
import { useUserContext } from "@app/features/users/UserProvider";
import clsx from "clsx";
import { useMemo } from "react";
import { useBetSearchFilter } from "../BetSearchFilterProvider";

function SearchParticipantFilter() {
  const { id } = useUserContext();
  const { bets, participantIds, setParticipant } = useBetSearchFilter();

  const friends = useMemo(() => {
    const participants = bets.flatMap((bet) => bet.participants);
    const unique = [
      ...new Map(participants.map((p) => [p.userId, p])).values(),
    ];
    return unique.filter((p) => p.userId !== id);
  }, [bets, id]);

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm">Participant:</span>
      <div className="flex gap-1">
        {friends.map((participant) => (
          <ParticipantAvatar
            key={participant.userId}
            participant={participant}
            activeIds={participantIds}
            onClick={setParticipant}
          />
        ))}
      </div>
    </div>
  );
}

interface ParticipantAvatarProps {
  activeIds: string[] | null;
  participant: CommonBetParticipantResponse;
  onClick: (participantId: string) => void;
}
function ParticipantAvatar({
  activeIds,
  participant,
  onClick,
}: ParticipantAvatarProps) {
  return (
    <button type="button" onClick={() => onClick(participant.userId)}>
      <img
        className={clsx([
          "avatar-search h-12 ",
          { active: activeIds?.includes(participant.userId) },
        ])}
        src={participant.avatarUrl}
        alt={participant.firstName}
      />
    </button>
  );
}

export default SearchParticipantFilter;
