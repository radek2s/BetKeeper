/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useAltText: <explanation> */
import type { ReactNode } from "react";
import type { BetParticipantResponse } from "../../model/betDto";

interface ParticipantsAvatarsProps {
  participants: BetParticipantResponse[];
  children?: ReactNode;
}
function ParticipantsAvatars({
  participants,
  children,
}: ParticipantsAvatarsProps) {
  return (
    <div className="flex items-center">
      <div className="bet-request__avatars">
        {participants.map((participant) => (
          <img
            key={participant.userId}
            className="w-[36px] h-[36px] avatar"
            src={participant.avatarUrl}
          />
        ))}
      </div>
      {children}
    </div>
  );
}

export default ParticipantsAvatars;
