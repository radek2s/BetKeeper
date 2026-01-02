/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useAltText: <explanation> */
"use client";
import { completeBet } from "@app/features/bets/actions";
import {
  type BetParticipantResponse,
  type BetResponse,
  isCommonBetResponse,
} from "@app/features/bets/model/betDto";
import { Button } from "@app/ui/button/Button";
import { ConfirmationDialog } from "@app/ui/confirm-dialog";
import { useCorbado } from "@corbado/react";
import type { UserType } from "@domain/user/entities";
import { useState } from "react";
import BetCreationDate from "../BetCreationDate";
import ParticipantsAvatars from "../ParticipantAvatars";
import { BetStatusComponent } from "./BetStatusComponent";

interface Props {
  bet: BetResponse;
  activeUser: UserType;
}
export function ResolvedBetDetails({ bet, activeUser }: Props) {
  const isActiveUserWinner = activeUser.id === bet.winnerId;

  const getWinner = () => {
    if (!bet.winnerId)
      throw new Error("Resolved bet must have defined winner!");
    const winner = bet.participants.find(
      ({ userId }) => userId === bet.winnerId,
    );
    if (!winner) throw new Error("Resolved bet must have defined winner!");
    return winner;
  };

  const getStakes = () => {
    if (isCommonBetResponse(bet)) {
      return bet.stake;
    } else {
      const user = bet.participants.find(
        ({ userId }) => bet.winnerId === userId,
      );
      if (!user) throw new Error("Unable to find winner");
      return user.stake;
    }
  };

  const getWinnerName = () => {
    return isActiveUserWinner ? "You" : getWinner().firstName;
  };

  return (
    <div className="">
      <header className="flex justify-between items-center">
        <ParticipantsAvatars participants={bet.participants}>
          <BetStatusComponent status={bet.status} />
        </ParticipantsAvatars>
        <BetCreationDate date={bet.createdAt} />
      </header>

      <div className="flex flex-col items-center max-w-[600px] md:min-w-[500px] text-center">
        <span className="text-2xl font-bold my-2">{bet.title}</span>
        <h2 className="font-bold">Terms</h2>
        <p className="text-xs text-gray">bet defined</p>
        <p className="my-3">{bet.terms}</p>

        <WinnerComponent
          winner={getWinner()}
          activeUser={activeUser}
          resolvedAt={bet.resolvedAt}
        />
        <hr className="vertical-line" />

        <div className="mb-2">
          <h2 className="font-bold">Stake</h2>
          <p className="text-xs text-gray">{getWinnerName()} gain:</p>
          <p>{getStakes()}</p>
        </div>
        <hr className="vertical-line" />

        {bet.status === "completed" ? (
          <div>
            <h2 className="font-bold">Completed</h2>
            <p className="text-sm">{bet.completedAt?.toLocaleString()}</p>
          </div>
        ) : (
          <CompleteBtn betId={bet.id} />
        )}
      </div>
    </div>
  );
}

interface WinnerComponentProps {
  winner: BetParticipantResponse;
  activeUser: UserType;
  resolvedAt?: Date;
}
function WinnerComponent({
  winner,
  activeUser,
  resolvedAt,
}: WinnerComponentProps) {
  const isActiveUserWinner = activeUser.id === winner.userId;
  const winnerName = isActiveUserWinner
    ? "You won"
    : `${winner.firstName} ${winner.lastName} won`;
  return (
    <div className="flex flex-col items-center">
      <div className="avatar-laurel">
        <img className="w-[64px] avatar" src={winner.avatarUrl} />
        <img className="h-[78px] laurel" src="/laurel.png" />
      </div>
      <span className="font-bold text-primary-500">{winnerName}</span>
      <span>{winner.claim}</span>
      <span className="text-xs text-gray">{resolvedAt?.toLocaleString()}</span>
    </div>
  );
}

interface CompleteBtnProps {
  betId: string;
}
function CompleteBtn({ betId }: CompleteBtnProps) {
  const { sessionToken } = useCorbado();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleComplete = async (result: boolean) => {
    if (!result) return;
    setIsLoading(true);
    try {
      completeBet(betId, sessionToken);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-bold">When winner recieved stake</h2>
      <p className="text-xs text-gray">
        Mark bet as completed when winner confirms that recieved his stake
      </p>
      <ConfirmationDialog
        content={""}
        title="Complete Bet"
        onClose={handleComplete}
        variant="primary"
        accept="Complete"
        isLoading={isLoading}>
        <Button variant="primary" className="my-2" isLoading={isLoading}>
          Complete
        </Button>
      </ConfirmationDialog>
    </div>
  );
}
