"use client";
import { useBetResolveMutation } from "@app/features/bets/api/betQuery";
import type {
  BetParticipantResponse,
  BetResponse,
} from "@app/features/bets/model/betDto";
import { Button } from "@app/ui/button/Button";
import { Dialog } from "radix-ui";
import { useState } from "react";
import BetCommonStake from "../BetCommonStake";
import BetCreationDate from "../BetCreationDate";
import ParticipantsAvatars from "../ParticipantAvatars";
import ParticipantDetails from "../ParticipantDetails";
import { BetResolver } from "./BetResolver";
import { BetStatusComponent } from "./BetStatusComponent";

interface Props {
  bet: BetResponse;
}
export function PendingBetDetails({ bet }: Props) {
  return (
    <div className="">
      <header className="flex justify-between items-center">
        <ParticipantsAvatars participants={bet.participants}>
          <BetStatusComponent status={bet.status} />
        </ParticipantsAvatars>
        <BetCreationDate date={new Date(bet.createdAt)} />
      </header>

      <div className="flex flex-col items-center max-w-[600px] md:min-w-[500px] text-center">
        <h2 className="font-bold">Terms</h2>
        <p className="text-xs text-gray">bet defined</p>
        <p className="my-3">{bet.terms}</p>
        <hr className="vertical-line" />
        {bet.stakeType === "COMMON" && <BetCommonStake stake={bet.stake} />}

        <h2 className="font-bold">Claims</h2>
        <p className="text-xs text-center text-gray">What has been agreed</p>
        <div className="bet-request--split my-2">
          <ParticipantDetails participant={bet.participants[0]} hideVotes />
          <hr className="vertical-line" />
          <ParticipantDetails participant={bet.participants[1]} hideVotes />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="font-bold">When terms can be resolved</h2>
          <p className="text-xs text-gray">
            Mark as resolved to determine winner of this bet
          </p>

          <ResolveBtn betId={bet.id} participants={bet.participants} />
        </div>
      </div>
    </div>
  );
}

interface ResolveProps {
  betId: string;
  participants: BetParticipantResponse[];
}
function ResolveBtn({ betId, participants }: ResolveProps) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { mutateAsync, isPending } = useBetResolveMutation(betId);

  const handleSelect = async (winnerId: string) => {
    try {
      await mutateAsync(winnerId);
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="primary" className="my-2" isLoading={isPending}>
          Resolve
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog--overlay" />
        <Dialog.Content className="dialog--content">
          <Dialog.Title className="dialog--title">Choose winner</Dialog.Title>
          <BetResolver participants={participants} onSelect={handleSelect} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
