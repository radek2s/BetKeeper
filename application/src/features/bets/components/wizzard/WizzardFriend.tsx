import { Button } from "@app/ui/button/Button";
import FormField from "@app/ui/form-field";
import type { BetParticipantRequest } from "@domain/bet";
import type { UserType } from "@domain/user/entities";
import { useMemo, useState } from "react";
import type { TermsResult } from "./types";

interface Props {
  friend?: UserType;
  terms?: TermsResult;
  onBack: () => void;
  onNext: (creator: BetParticipantRequest) => void;
}
export function WizzardFriend({ friend, terms, onBack, onNext }: Props) {
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
      <p className="text-center text-xs">{terms.terms}</p>
      <div className="flex flex-col items-center my-2">
        <img src={friend.avatarUrl} className="avatar w-[64px]" alt="Profile" />

        <div className="flex flex-col items-center mb-2">
          <h3 className="mt-1">
            {friend.firstName} {friend.lastName}
          </h3>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <FormField
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          label="Claims"
          name="claim"
          placeholder={`What ${friend.firstName} claim...`}
        />
        {terms.stakeType === "INDIVIDUAL" && (
          <FormField
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            label="Stake"
            name="stake"
            placeholder={`When ${friend.firstName} win...`}
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
          onClick={handleNext}>
          Create
        </Button>
      </div>
    </div>
  );
}
