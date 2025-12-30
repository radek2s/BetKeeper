/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useAltText: <explanation> */
"use client";

import { approveBet, rejectBet, startBet } from "@app/features/bets/actions";
import type {
  BetParticipantResponse,
  BetRequestResponse,
} from "@app/features/bets/model/betDto";
import { Button } from "@app/ui/button/Button";
import { useCorbado } from "@corbado/react";
import clsx from "clsx";
import BetCommonStake from "../BetCommonStake";
import BetCreationDate from "../BetCreationDate";
import ParticipantsAvatars from "../ParticipantAvatars";
import ParticipantDetails from "../ParticipantDetails";

interface Props {
  betRequest: BetRequestResponse;
}
export function BetRequestDetails({ betRequest }: Props) {
  return (
    <div className="">
      <header className="flex justify-between items-center">
        <ParticipantsAvatars participants={betRequest.participants}>
          <RequestStatus participants={betRequest.participants} />
        </ParticipantsAvatars>
        <BetCreationDate date={betRequest.createdAt} />
      </header>

      <div className="flex flex-col items-center max-w-[600px] text-center">
        <span className="text-2xl font-bold my-2">{betRequest.title}</span>
        <h2 className="font-bold">Terms</h2>
        <p className="text-xs text-gray">bet defined</p>
        <p className="my-3">{betRequest.terms}</p>
        <hr className="vertical-line" />
        {betRequest.stakeType === "COMMON" && (
          <BetCommonStake stake={betRequest.stake} />
        )}
        <h2 className="font-bold">Aggreements</h2>
        <p className="text-xs text-center text-gray">
          accept if you agree with bet terms and stakes, modify if you want to
          correct them or reject to decline bet request and do not participate
          in it.
        </p>
        <div className="bet-request--split my-2">
          <ParticipantDetails participant={betRequest.participants[0]} />
          <hr className="vertical-line" />
          <ParticipantDetails participant={betRequest.participants[1]} />
        </div>
        <VoteActions betRequestId={betRequest.id} />
        <StartBetButton
          betRequestId={betRequest.id}
          participants={betRequest.participants}
        />
      </div>
    </div>
  );
}

interface ParticipantsAndStatusProps {
  participants: BetParticipantResponse[];
}

function RequestStatus({ participants }: ParticipantsAndStatusProps) {
  const approved = participants.every(({ vote }) => vote === "approved");
  const rejected = participants.some(({ vote }) => vote === "rejected");

  const getStatus = () => {
    if (approved) return "Approved";
    if (rejected) return "Rejected";
    return "Pending";
  };

  return (
    <div
      className={clsx([
        "py-1 px-4 rounded-xl bet-request-status",
        getStatus().toLowerCase(),
      ])}>
      {getStatus()}
    </div>
  );
}

interface BetIdProps {
  betRequestId: string;
}
function VoteActions({ betRequestId }: BetIdProps) {
  const { sessionToken } = useCorbado();

  const handleApprove = async () => {
    try {
      await approveBet(betRequestId, sessionToken);
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async () => {
    try {
      await rejectBet(betRequestId, sessionToken);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex justify-center gap-4 my-4">
      <Button variant="error" onClick={handleReject}>
        Reject
      </Button>
      <Button>Modify</Button>
      <Button variant="primary" onClick={handleApprove}>
        Accept
      </Button>
    </div>
  );
}

interface StartBetButtonProps {
  betRequestId: string;
  participants: BetParticipantResponse[];
}
function StartBetButton({ betRequestId, participants }: StartBetButtonProps) {
  const { sessionToken } = useCorbado();

  const approved = participants.every(({ vote }) => vote === "approved");

  const handleStart = async () => {
    try {
      await startBet(betRequestId, sessionToken);
    } catch (e) {
      console.error(e);
    }
  };

  if (approved)
    return (
      <Button className="w-full" variant="primary" onClick={handleStart}>
        Start
      </Button>
    );
  return null;
}
