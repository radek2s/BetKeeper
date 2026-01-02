import { Button } from "@app/ui/button/Button";
import FormField from "@app/ui/form-field";
import type { BetParticipantRequest } from "@domain/bet";
import type { UserType } from "@domain/user/entities";
import { useMemo, useState } from "react";
import type { TermsResult } from "./types";

interface Props {
  friend?: UserType;
  terms?: TermsResult;
  isLoading?: boolean;
  onBack: () => void;
  onNext: (creator: BetParticipantRequest) => void;
}
export function WizzardFriend({
  friend,
  terms,
  isLoading,
  onBack,
  onNext,
}: Props) {
  const [claim, setClaim] = useState<string>("");
  const [stake, setStake] = useState<string>("");

  const handleNext = () => {
    if (!claim) return;
    if (!friend) return;

    onNext({
      userId: friend.id,
      claim,
      stake,
    });
  };

  const isValid = useMemo(() => {
    const isValidStake = terms?.stakeType === "INDIVIDUAL" ? !!stake : true;
    return !!claim && isValidStake;
  }, [claim, stake, terms]);

  if (!terms || !friend) return <div>Setup terms!</div>;

  return (
    <div className="mt-4">
      <p className="text-center text-xs my-2">{terms.terms}</p>
      <div className="flex flex-col items-center my-2">
        <img
          src={friend.avatarUrl || "/avatars/avatar_00.png"}
          className="avatar w-[64px]"
          alt="Profile"
        />
        <h2 className="text-center">
          Define {friend.firstName} {friend.lastName} claims
        </h2>
      </div>
      <div className="flex flex-col items-center my-2"></div>
      <div className="flex flex-col gap-2">
        <FormField
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          label={`What ${friend.firstName} claims?`}
          name="claim"
          placeholder="eg.: It will be raining"
        />
        {terms.stakeType === "INDIVIDUAL" && (
          <FormField
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            label={`What ${friend.firstName} wants for a stake?`}
            name="stake"
            placeholder="eg.: I want a coffee..."
          />
        )}
      </div>
      <div className="flex gap-2 justify-center mt-4 w-full">
        <Button className="w-full" onClick={onBack}>
          Back
        </Button>
        <Button
          disabled={!isValid}
          className="w-full"
          variant="primary"
          onClick={handleNext}
          isLoading={isLoading}>
          Create
        </Button>
      </div>
    </div>
  );
}
