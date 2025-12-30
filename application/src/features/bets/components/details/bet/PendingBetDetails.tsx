"use client";
import { resolveBet } from "@app/features/bets/actions";
import type {
  BetParticipantResponse,
  BetResponse,
} from "@app/features/bets/model/betDto";
import { Button } from "@app/ui/button/Button";
import { useCorbado } from "@corbado/react";
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
        <BetCreationDate date={bet.createdAt} />
      </header>

      <div className="flex flex-col items-center max-w-[600px] text-center">
        <span className="text-2xl font-bold my-2">{bet.title}</span>
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
        {/* <VoteActions betRequestId={betRequest.id} />
        <StartBetButton
          betRequestId={betRequest.id}
          participants={betRequest.participants}
        /> */}
        <ResolveBtn betId={bet.id} participants={bet.participants} />
      </div>
    </div>
  );
}

interface ResolveProps {
  betId: string;
  participants: BetParticipantResponse[];
}
function ResolveBtn({ betId, participants }: ResolveProps) {
  const { sessionToken } = useCorbado();
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleSelect = async (winnerId: string) => {
    try {
      resolveBet(betId, winnerId, sessionToken);
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="primary">Resolve</Button>
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
