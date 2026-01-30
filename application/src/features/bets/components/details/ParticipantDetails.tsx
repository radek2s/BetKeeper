/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useAltText: <explanation> */

import { IconButton } from "@app/ui/button/IconButton";
import { Icon } from "@app/ui/icon";
import { Input } from "@app/ui/input/Input";
import type { VoteType } from "@domain/bet";
import type { UserType } from "@domain/user/entities";
import { useState } from "react";
import {
  useBetRequestClaimsMutation,
  useBetRequestStakesMutation,
} from "../../api/betQuery";
import {
  type BetParticipantResponse,
  isIndividualBetParticipantResponse,
} from "../../model/betDto";

interface ParticipantDetailsProps {
  betRequestId?: string;
  participant: BetParticipantResponse;
  currentUser?: UserType;
  hideVotes?: boolean;
}
function ParticipantDetails({
  betRequestId,
  participant,
  currentUser,
  hideVotes,
}: ParticipantDetailsProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [claim, setClaim] = useState<string>(participant.claim);

  const { mutateAsync, isPending, isError } = useBetRequestClaimsMutation(
    betRequestId ?? "",
  );

  const isEditable = currentUser?.id === participant.userId;

  const handleClose = () => {
    setClaim(participant.claim);
    setEditMode(false);
  };

  const handleUpdate = async () => {
    if (!betRequestId) return;
    try {
      await mutateAsync(claim);
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col items-center w-full mx-1">
      <div className="my-2 flex flex-col items-center">
        <img className="w-[32px] h-[32px] avatar" src={participant.avatarUrl} />
        <p>
          {participant.firstName} {participant.lastName}
        </p>
      </div>
      <div className="my-2">
        <p className="text-xs text-gray">claims that:</p>
        {isEditable ? (
          editMode ? (
            <div className="flex flex-col gap-1">
              <Input value={claim} onChange={(e) => setClaim(e.target.value)} />
              {isError && <p className="text-error">Failed to update claims</p>}
              <div className="flex justify-center gap-2">
                <IconButton icon="close" onClick={handleClose} />
                <IconButton
                  icon="send"
                  variant="primary"
                  onClick={handleUpdate}
                  isLoading={isPending}
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="text-center text-sm clickable hoverable px-2 py-1 rounded-lg"
              onClick={() => setEditMode(true)}>
              {participant.claim}
            </button>
          )
        ) : (
          <p className="text-center text-sm py-1">{participant.claim}</p>
        )}
      </div>
      {isIndividualBetParticipantResponse(participant) && (
        <ParticipantStake
          isEditable={isEditable}
          betRequestId={betRequestId}
          stake={participant.stake}
        />
      )}
      {!hideVotes && (
        <div>
          <p className="text-xs text-gray">vote</p>
          <ParticipantVote vote={participant.vote} />
        </div>
      )}
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

interface ParticipantStakeProps {
  betRequestId?: string;
  isEditable: boolean;
  stake: string;
}
function ParticipantStake({
  betRequestId,
  isEditable,
  stake,
}: ParticipantStakeProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newStake, setNewStake] = useState<string>(stake);
  const { mutateAsync, isPending } = useBetRequestStakesMutation(
    betRequestId ?? "",
  );

  const handleClose = () => {
    setNewStake(stake);
    setEditMode(false);
  };

  const handleUpdate = async () => {
    if (!betRequestId) return;
    try {
      await mutateAsync(newStake);
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="flex flex-col items-center my-2">
      <p className="text-xs text-gray">when win:</p>
      {isEditable ? (
        editMode ? (
          <div className="flex flex-col gap-1">
            <Input
              value={newStake}
              onChange={(e) => setNewStake(e.target.value)}
            />
            <div className="flex justify-center gap-2">
              <IconButton icon="close" onClick={handleClose} />
              <IconButton
                icon="send"
                variant="primary"
                onClick={handleUpdate}
                isLoading={isPending}
              />
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="text-center text-sm clickable hoverable px-2 py-1 rounded-lg"
            onClick={() => setEditMode(true)}>
            {stake}
          </button>
        )
      ) : (
        <p className="text-sm py-1">{stake}</p>
      )}
    </div>
  );
}

export default ParticipantDetails;
