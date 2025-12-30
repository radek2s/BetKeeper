import type { BetParticipantRequest } from "@domain/bet";
import type { UserType } from "@domain/user/entities";
import { useState } from "react";
import {
  type BetRequestCreate,
  isBetParticipantRequest,
  isTermsResult,
  type TermsResult,
} from "./types";
import { WizzardCreator } from "./WizzardCreator";
import { WizzardFriend } from "./WizzardFriend";
import { WizzardParticipants } from "./WizzardParticipants";
import { WizzardProgress } from "./WizzardProgress";
import { WizzardTerms } from "./WizzardTerms";

interface Props {
  creator: UserType;
  friends: UserType[];
  onCancel: () => void;
  onSend: (request: BetRequestCreate) => void;
}
export function BetRequestWizzard({
  creator,
  friends,
  onCancel,
  onSend,
}: Props) {
  const [step, setStep] = useState<number>(0);
  const [terms, setTerms] = useState<TermsResult>();
  const [friend, setFriend] = useState<UserType>();
  const [creatorRequest, setCreatorRequest] = useState<BetParticipantRequest>();

  const handleCancel = () => {
    onCancel();
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const onNext = (result: TermsResult | UserType | BetParticipantRequest) => {
    if (isTermsResult(result)) {
      setTerms(result);
    } else if (isBetParticipantRequest(result)) {
      setCreatorRequest(result);
    } else {
      setFriend(result);
    }
    setStep((s) => s + 1);
  };

  const handleSend = (friendRequest: BetParticipantRequest) => {
    if (!terms) return;
    if (!friend) return;
    if (!creatorRequest) return;

    const request: BetRequestCreate = {
      title: terms.title,
      terms: terms.terms,
      stake: terms.stake,
      stakeType: terms.stakeType,
      creatorId: creator.id,
      participants: [creatorRequest, friendRequest],
    };

    onSend(request);
  };

  const getComponent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <WizzardTerms terms={terms} onCancel={handleCancel} onNext={onNext} />
        );
      case 1:
        return (
          <WizzardCreator
            creator={creator}
            creatorRequest={creatorRequest}
            terms={terms}
            onNext={onNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <WizzardParticipants
            friends={friends}
            selectedFriend={friend}
            onBack={handleBack}
            onNext={onNext}
          />
        );
      case 3:
        return (
          <WizzardFriend
            friend={friend}
            terms={terms}
            onBack={handleBack}
            onNext={handleSend}
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-1/2">
        <WizzardProgress progress={step} />
      </div>

      <div className="w-2/3">{getComponent(step)}</div>
    </div>
  );
}
