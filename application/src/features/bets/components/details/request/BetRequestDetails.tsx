/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useAltText: <explanation> */
"use client";

import {
  useBetRequestApproveMutation,
  useBetRequestRejectMutation,
  useBetRequestTermsMutation,
  useBetStartMutation,
} from "@app/features/bets/api/betQuery";
import type {
  BetParticipantResponse,
  BetRequestResponse,
} from "@app/features/bets/model/betDto";
import { Button } from "@app/ui/button/Button";
import { IconButton } from "@app/ui/button/IconButton";
import { Icon } from "@app/ui/icon";
import { Input } from "@app/ui/input/Input";
import type { VoteType } from "@domain/bet";
import type { UserType } from "@domain/user/entities";
import clsx from "clsx";
import { useState } from "react";
import BetCommonStake from "../BetCommonStake";
import BetCreationDate from "../BetCreationDate";
import ParticipantsAvatars from "../ParticipantAvatars";
import ParticipantDetails from "../ParticipantDetails";

interface Props {
  betRequest: BetRequestResponse;
  activeUser: UserType;
}
export function BetRequestDetails({ betRequest, activeUser }: Props) {
  const activeUserVote = betRequest.participants.find(
    ({ userId }) => userId === activeUser.id,
  )?.vote;
  return (
    <div className="">
      <header className="flex justify-between items-center">
        <ParticipantsAvatars participants={betRequest.participants}>
          <RequestStatus participants={betRequest.participants} />
        </ParticipantsAvatars>
        <BetCreationDate date={new Date(betRequest.createdAt)} />
      </header>

      <div className="flex flex-col items-center max-w-[600px] text-center">
        {/* <span className="text-2xl font-bold my-2">{betRequest.title}</span> */}

        <BetTerms betRequest={betRequest} />

        <hr className="vertical-line" />
        {betRequest.stakeType === "COMMON" && (
          <BetCommonStake
            betRequestId={betRequest.id}
            stake={betRequest.stake}
          />
        )}
        <h2 className="font-bold">Aggreements</h2>
        <p className="text-xs text-center text-gray">
          accept if you agree with bet terms and stakes, modify if you want to
          correct them or reject to decline bet request and do not participate
          in it.
        </p>
        <div className="bet-request--split my-2">
          <ParticipantDetails
            betRequestId={betRequest.id}
            currentUser={activeUser}
            participant={betRequest.participants[0]}
          />
          <hr className="vertical-line" />
          <ParticipantDetails
            betRequestId={betRequest.id}
            currentUser={activeUser}
            participant={betRequest.participants[1]}
          />
        </div>
        <VoteActions
          activeUserVote={activeUserVote}
          betRequestId={betRequest.id}
        />
        <StartBetButton
          betRequestId={betRequest.id}
          participants={betRequest.participants}
        />
      </div>
    </div>
  );
}

interface BetTermsProps {
  betRequest: BetRequestResponse;
}
function BetTerms({ betRequest }: BetTermsProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [terms, setTerms] = useState<string>(betRequest.terms);

  const { mutateAsync, isPending } = useBetRequestTermsMutation(betRequest.id);

  const handleClose = () => {
    setTerms(betRequest.terms);
    setEditMode(false);
  };

  const handleUpdate = async () => {
    try {
      await mutateAsync(terms);
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="w-full">
      <h2 className="font-bold">Terms</h2>
      <p className="text-xs text-gray">bet defined</p>
      {editMode ? (
        <div className="flex gap-1 items-center my-2">
          <Input
            className="w-full"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
          <IconButton icon="close" onClick={handleClose} />
          <IconButton
            icon="send"
            variant="primary"
            onClick={handleUpdate}
            isLoading={isPending}
          />
        </div>
      ) : (
        <button
          type="button"
          className="my-3 clickable hoverable px-2 py-1 rounded-lg"
          onClick={() => setEditMode(true)}>
          {betRequest.terms}
        </button>
      )}
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
  activeUserVote?: VoteType;
  betRequestId: string;
}
function VoteActions({ activeUserVote, betRequestId }: BetIdProps) {
  const { mutateAsync: approve, isPending: isApprovePending } =
    useBetRequestApproveMutation(betRequestId);
  const { mutateAsync: reject, isPending: isRejectPending } =
    useBetRequestRejectMutation(betRequestId);

  const isLoading = isApprovePending || isRejectPending;

  const handleApprove = async () => {
    try {
      await approve();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async () => {
    try {
      await reject();
    } catch (e) {
      console.error(e);
    }
  };

  if (activeUserVote === "approved")
    return (
      <div className="flex flex-col items-center my-2">
        <h3 className="font-bold">You approved this bet request</h3>
        <p className="text-xs text-gray">
          You already approved this bet request but you can still make changes
          or reject it.
        </p>
        <Button onClick={handleReject} className="mt-1" isLoading={isLoading}>
          Reject
        </Button>
      </div>
    );

  if (activeUserVote === "rejected")
    return (
      <div className="flex flex-col items-center my-2">
        <h3 className="font-bold">You rejected this bet request</h3>
        <p className="text-xs text-gray">
          You rejected this bet request with currenct state. Any change in this
          bet will reset your decision.
        </p>
        <Button onClick={handleApprove} className="mt-1" isLoading={isLoading}>
          Approve
        </Button>
      </div>
    );

  return (
    <div className="my-2">
      <h3 className="font-bold">Your decision</h3>
      <p className="text-xs text-gray">
        If you want to modify terms, stakes or agreements just click on specific
        element.
      </p>
      <div className="flex justify-center gap-4 my-4">
        {isLoading ? (
          <div className="btn--loader" />
        ) : (
          <>
            <Button variant="error" onClick={handleReject}>
              Reject
            </Button>
            <Button variant="primary" onClick={handleApprove}>
              Accept
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

interface StartBetButtonProps {
  betRequestId: string;
  participants: BetParticipantResponse[];
}
function StartBetButton({ betRequestId, participants }: StartBetButtonProps) {
  const { mutateAsync, isPending } = useBetStartMutation(betRequestId);

  const approved = participants.every(({ vote }) => vote === "approved");

  const handleStart = async () => {
    try {
      await mutateAsync();
    } catch (e) {
      console.error(e);
    }
  };

  if (approved)
    return (
      <div className="flex flex-col items-center">
        <hr className="vertical-line" />
        <h2 className="font-bold">All participants approved!</h2>
        <p className="text-xs text-gray">
          Make a deal and convert request to immutable bet.
        </p>

        <Button
          className="w-full font-bold my-2"
          variant="primary"
          onClick={handleStart}
          isLoading={isPending}>
          <Icon name="handshake" />
          Make deal
        </Button>
      </div>
    );
  return null;
}
