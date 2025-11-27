import { UserStatus } from "@domain/user";
import type { UserType } from "@domain/user/entities";
import { useState } from "react";
import {
  type BetRequestCreate,
  isTermsResult,
  type StakeResult,
  type TermsResult,
} from "./types";
import { WizzardParticipants } from "./WizzardParticipants";
import { WizzardProgress } from "./WizzardProgress";
import { WizzardStake } from "./WizzardStake";
import { WizzardTerms } from "./WizzardTerms";

interface Props {
  friends: UserType[];
  onCancel: () => void;
  onSend: (request: BetRequestCreate) => void;
}
export function BetRequestWizzard({ friends, onCancel, onSend }: Props) {
  const [step, setStep] = useState<number>(0);
  const [terms, setTerms] = useState<TermsResult>();
  const [friend, setFriend] = useState<UserType>();

  const handleCancel = () => {
    onCancel();
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  const onNext = (result: TermsResult | UserType) => {
    if (isTermsResult(result)) {
      setTerms(result);
    } else {
      setFriend(result);
    }
    setStep((s) => s + 1);
  };

  const handleSend = (stake: StakeResult) => {
    if (!terms) return;
    if (!friend) return;

    const request = {
      title: terms.title,
      description: terms.description,
      friendId: friend.id,
      ...stake,
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
          <WizzardParticipants
            selectedFriend={friend}
            onNext={onNext}
            onBack={handleBack}
            friends={friends}
          />
        );
      case 2:
        return (
          <WizzardStake
            selectedFriendName={friend?.firstName || ""}
            onCancel={handleBack}
            onSend={handleSend}
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
