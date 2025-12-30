import { ProfileImage } from "@app/features/profile/components/ProfileImage";
import type { AuthorizedUser } from "@app/lib/user/AuthorizedUser";
import { Button } from "@app/ui/button/Button";
import FormField from "@app/ui/form-field";
import type { BetParticipantRequest } from "@domain/bet";
import type { UserType } from "@domain/user/entities";
import { useRef } from "react";
import type { TermsResult } from "./types";

interface Props {
  creator: UserType;
  terms?: TermsResult;
  onBack: () => void;
  onNext: (creator: BetParticipantRequest) => void;
}
export function WizzardCreator({ creator, terms, onBack, onNext }: Props) {
  const requestClaimRef = useRef<HTMLInputElement>(null);
  const requestStakeRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    const claim = requestClaimRef.current?.value;
    const stake = requestStakeRef.current?.value;

    if (!claim) return;

    onNext({
      userId: creator.id,
      claim,
      stake,
    });
  };

  if (!terms) return <div>Setup terms!</div>;

  return (
    <div>
      <p className="text-center my-1">{terms.terms}</p>
      <div className="flex flex-col items-center">
        <img
          src={creator.avatarUrl}
          className="avatar w-[64px]"
          alt="Profile"
        />

        <div className="flex flex-col items-center my-2">
          <h2 className="text-xl m-none">
            {creator.firstName} {creator.lastName}
          </h2>
          <span className="text-gray text-sm">(You)</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <FormField
          ref={requestClaimRef}
          label="Claim"
          name="claim"
          placeholder="What you claim..."
        />
        {terms.stakeType === "INDIVIDUAL" && (
          <FormField
            ref={requestStakeRef}
            label="Stake"
            name="stake"
            placeholder="When you win..."
          />
        )}
      </div>
      <div className="flex gap-2 justify-center mt-4 w-full">
        <Button className="w-full" onClick={onBack}>
          Back
        </Button>
        <Button className="w-full" variant="primary" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
