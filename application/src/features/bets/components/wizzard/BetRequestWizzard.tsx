import { UserStatus } from "@domain/user";
import type { UserType } from "@domain/user/entities";
import { useState } from "react";
import { isTermsResult, type TermsResult } from "./types";
import { WizzardParticipants } from "./WizzardParticipants";
import { WizzardProgress } from "./WizzardProgress";
import { WizzardStake } from "./WizzardStake";
import { WizzardTerms } from "./WizzardTerms";

export function BetRequestWizzard() {
  const [step, setStep] = useState<number>(0);
  const [terms, setTerms] = useState<TermsResult>();
  const [friend, setFriend] = useState<UserType>();

  const handleCancel = () => {
    console.log("cancelled");
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
            friends={[
              {
                id: "1",
                email: "test@email.com",
                firstName: "Brian",
                lastName: "Smith",
                avatarUrl: "avatars/avatar_01.png",
                role: undefined,
                status: UserStatus.ACTIVE,
              },
              {
                id: "2",
                email: "noone@email.com",
                firstName: "Josh",
                lastName: "Smith",
                avatarUrl: "avatars/avatar_03.png",
                role: undefined,
                status: UserStatus.ACTIVE,
              },
            ]}
          />
        );
      case 2:
        return (
          <WizzardStake
            selectedFriendName={friend?.firstName || ""}
            onCancel={handleBack}
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
