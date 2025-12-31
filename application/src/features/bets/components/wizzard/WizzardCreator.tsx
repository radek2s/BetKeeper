import { ProfileImage } from "@app/features/profile/components/ProfileImage";
import type { AuthorizedUser } from "@app/lib/user/AuthorizedUser";
import { Button } from "@app/ui/button/Button";
import FormField from "@app/ui/form-field";
import type { BetParticipantRequest } from "@domain/bet";
import type { UserType } from "@domain/user/entities";
import { useMemo, useRef, useState } from "react";
import type { TermsResult } from "./types";

interface Props {
  creator: UserType;
  terms?: TermsResult;
  creatorRequest?: BetParticipantRequest;
  onBack: () => void;
  onNext: (creator: BetParticipantRequest) => void;
}
export function WizzardCreator({
  creator,
  terms,
  creatorRequest,
  onBack,
  onNext,
}: Props) {
  const [claim, setClaim] = useState<string>(creatorRequest?.claim ?? "");
  const [stake, setStake] = useState<string>(creatorRequest?.stake ?? "");

  const handleNext = () => {
    if (!claim) return;

    onNext({
      userId: creator.id,
      claim,
      stake,
    });
  };

  const isValid = useMemo(() => {
    const isValidStake = terms?.stakeType === "INDIVIDUAL" ? !!stake : true;
    return !!claim && isValidStake;
  }, [claim, stake, terms]);

  if (!terms) return <div>Setup terms!</div>;

  return (
    <div className="mt-4">
      <p className="my-2 text-center text-xs">{terms.terms}</p>
      <div className="flex flex-col items-center my-2">
        <img
          src={creator.avatarUrl || "/avatars/avatar_00.png"}
          className="avatar w-[64px]"
          alt="Profile"
        />
        <h2 className="text-center">Define your claims</h2>
      </div>
      <div className="flex flex-col gap-2">
        <FormField
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          label="What are your claims?"
          name="claim"
          placeholder="eg.: It will be sunny"
        />
        {terms.stakeType === "INDIVIDUAL" && (
          <FormField
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            label="What you want when you win?"
            name="stake"
            placeholder="eg.: I want a croissant..."
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
          Next
        </Button>
      </div>
    </div>
  );
}
