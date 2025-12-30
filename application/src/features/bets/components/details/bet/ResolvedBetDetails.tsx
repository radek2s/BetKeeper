/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useAltText: <explanation> */
"use client";
import { resolveBet } from "@app/features/bets/actions";
import type {
  BetParticipantResponse,
  BetResponse,
} from "@app/features/bets/model/betDto";
import { AuthorizedUser } from "@app/lib/user/AuthorizedUser";
import { Button } from "@app/ui/button/Button";
import { useCorbado } from "@corbado/react";
import type { UserType } from "@domain/user/entities";
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
  activeUser: UserType;
}
export function ResolvedBetDetails({ bet, activeUser }: Props) {
  const getWinner = () => {
    if (!bet.winnerId)
      throw new Error("Resolved bet must have defined winner!");
    const winner = bet.participants.find(
      ({ userId }) => userId === bet.winnerId,
    );
    if (!winner) throw new Error("Resolved bet must have defined winner!");
    return winner;
  };

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

        <WinnerComponent winner={getWinner()} activeUser={activeUser} />
        <hr className="vertical-line" />
        {bet.stakeType === "COMMON" && <BetCommonStake stake={bet.stake} />}

        <h2 className="font-bold">Claims</h2>
        <p className="text-xs text-center text-gray">What has been agreed</p>
        {/* <VoteActions betRequestId={betRequest.id} />
        <StartBetButton
          betRequestId={betRequest.id}
          participants={betRequest.participants}
        /> */}
      </div>
    </div>
  );
}

interface WinnerComponentProps {
  winner: BetParticipantResponse;
  activeUser: UserType;
}
function WinnerComponent({ winner, activeUser }: WinnerComponentProps) {
  const isActiveUserWinner = activeUser.id === winner.userId;
  const winnerName = isActiveUserWinner
    ? "You won"
    : `${winner.firstName} ${winner.lastName} won`;
  return (
    <div className="flex flex-col items-center">
      <img className="w-[48px] avatar" src={winner.avatarUrl} />
      <span>{winnerName}</span>
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
