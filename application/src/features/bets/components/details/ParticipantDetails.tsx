/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/a11y/useAltText: <explanation> */
import { Icon } from "@app/ui/icon";
import type { VoteType } from "@domain/bet";
import {
  type BetParticipantResponse,
  isIndividualBetParticipantResponse,
} from "../../model/betDto";

interface ParticipantDetailsProps {
  participant: BetParticipantResponse;
  hideVotes?: boolean;
}
function ParticipantDetails({
  participant,
  hideVotes,
}: ParticipantDetailsProps) {
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
      {!hideVotes && <ParticipantVote vote={participant.vote} />}
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

export default ParticipantDetails;
