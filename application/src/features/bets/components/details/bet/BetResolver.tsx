/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useAltText: <explanation> */
"use client";
import type { BetParticipantResponse } from "@app/features/bets/model/betDto";
import { Button } from "@app/ui/button/Button";
import clsx from "clsx";
import { useState } from "react";

interface Props {
  participants: BetParticipantResponse[];
  onSelect: (winnerId: string) => Promise<void>;
}
export function BetResolver({ participants, onSelect }: Props) {
  const [winnerId, setWinnerId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelect = async () => {
    setIsLoading(true);
    if (!winnerId) return;
    await onSelect(winnerId);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 w-full mb-4">
        {participants.map((participant) => (
          <ParticipantSelector
            key={participant.userId}
            participant={participant}
            selectedId={winnerId}
            onSelect={setWinnerId}
          />
        ))}
      </div>
      <Button
        variant="primary"
        disabled={!winnerId}
        onClick={handleSelect}
        isLoading={isLoading}>
        Accept
      </Button>
    </div>
  );
}

interface ParticipantSelectorProps {
  onSelect: (id: string) => void;
  participant: BetParticipantResponse;
  selectedId?: string;
}
function ParticipantSelector({
  participant,
  onSelect,
  selectedId,
}: ParticipantSelectorProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(participant.userId)}
      className={clsx([
        "bet-resolve--participant rounded-lg w-full py-4 flex flex-col items-center",
        { active: selectedId === participant.userId },
      ])}>
      <img className="w-[32px] avatar" src={participant.avatarUrl} />
      <p>
        {participant.firstName} {participant.lastName}
      </p>
    </button>
  );
}
