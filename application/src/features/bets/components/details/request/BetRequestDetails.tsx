/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useAltText: <explanation> */
"use client";

import {
  type BetParticipantResponse,
  type BetRequestResponse,
  isIndividualBetParticipantResponse,
} from "@app/features/bets/model/betDto";
import { Button } from "@app/ui/button/Button";
import { Icon } from "@app/ui/icon";
import { StakeType, type VoteType } from "@domain/bet";
import clsx from "clsx";

interface Props {
  betRequest: BetRequestResponse;
}
export function BetRequestDetails({ betRequest }: Props) {
  return (
    <div className="">
      <header>
        <ParticipantsAndStatus participants={betRequest.participants} />
      </header>

      <div className="flex flex-col items-center max-w-[600px] text-center">
        <span className="text-2xl font-bold my-2">{betRequest.title}</span>
        <h2 className="font-bold">Terms</h2>
        <p className="text-xs text-gray">bet defined</p>
        <p className="my-3">{betRequest.terms}</p>
        <hr className="vertical-line" />
        {betRequest.stakeType === "COMMON" && (
          <CommonStakes stake={betRequest.stake} />
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
        <VoteActions />
      </div>
    </div>
  );
}

interface CommonStakesProps {
  stake: string;
}
function CommonStakes({ stake }: CommonStakesProps) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="font-bold">Stakes</h2>
      <p className="text-xs text-gray">when anyone win he:</p>
      <p className="my-3">{stake}</p>
      <hr className="vertical-line" />
    </div>
  );
}

interface ParticipantDetailsProps {
  participant: BetParticipantResponse;
}
function ParticipantDetails({ participant }: ParticipantDetailsProps) {
  return (
    <div className="flex flex-col items-center w-full mx-1">
      <div className="my-2 flex flex-col items-center">
        <img className="w-[32px] avatar" src={participant.avatarUrl} />
        <p>
          {participant.firstName} {participant.lastName}
        </p>
      </div>
      <div className="my-2">
        <p className="text-xs text-gray">claims that:</p>
        <p className="text-center text-sm">{participant.claim}</p>
      </div>
      {isIndividualBetParticipantResponse(participant) && (
        <ParticipantStake stake={participant.stake} />
      )}
      <ParticipantVote vote={participant.vote} />
    </div>
  );
}

interface ParticipantsAndStatusProps {
  participants: BetParticipantResponse[];
}
function ParticipantsAndStatus({ participants }: ParticipantsAndStatusProps) {
  return (
    <div className="flex items-center">
      <div className="bet-request__avatars">
        {participants.map((participant) => (
          <img
            key={participant.userId}
            className="w-[48px] avatar"
            src={participant.avatarUrl}
          />
        ))}
      </div>
      <RequestStatus participants={participants} />
    </div>
  );
}

interface ParticipantStakeProps {
  stake: string;
}
function ParticipantStake({ stake }: ParticipantStakeProps) {
  return (
    <div className="flex flex-col items-center my-2">
      <p className="text-xs text-gray">when win:</p>
      <p className="text-sm">{stake}</p>
    </div>
  );
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

interface ParticipantVoteProps {
  vote: VoteType;
}
function ParticipantVote({ vote }: ParticipantVoteProps) {
  switch (vote) {
    case "approved":
      return <Icon name="check" className="vote-approved" />;
    case "rejected":
      return <Icon name="close" className="vote-rejected" />;
    case "unknown":
      return <Icon name="question-mark" />;
  }
}

function VoteActions() {
  return (
    <div className="flex justify-center gap-4 my-4">
      <Button variant="error">Reject</Button>
      <Button>Modify</Button>
      <Button variant="primary">Accept</Button>
    </div>
  );
}
