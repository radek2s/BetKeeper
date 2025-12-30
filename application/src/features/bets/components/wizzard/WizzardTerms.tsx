/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { Button } from "@app/ui/button/Button";
import FormField from "@app/ui/form-field";
import { Select, SelectItem } from "@app/ui/select";
import TextField from "@app/ui/text-field";
import type { StakeType } from "@domain/bet";
import { useEffect, useRef, useState } from "react";
import type { TermsResult } from "./types";

interface Props {
  terms?: TermsResult;
  onCancel: () => void;
  onNext: (result: TermsResult) => void;
}
export function WizzardTerms({ terms, onCancel, onNext }: Props) {
  const [stakeType, setStakeType] = useState<StakeType>(
    terms?.stakeType || "INDIVIDUAL",
  );
  const requestTitleRef = useRef<HTMLInputElement>(null);
  const requestTermsRef = useRef<HTMLTextAreaElement>(null);
  const requestStakeRef = useRef<HTMLTextAreaElement>(null);
  const handleNext = () => {
    const title = requestTitleRef.current?.value;
    if (!title) return;
    const terms = requestTermsRef.current?.value;
    if (!terms) return;
    const stake = requestStakeRef.current?.value;
    onNext({
      title,
      terms,
      stakeType,
      stake,
    });
  };

  useEffect(() => {
    if (
      terms &&
      requestTitleRef.current &&
      requestTermsRef.current &&
      requestStakeRef.current
    ) {
      requestTitleRef.current.value = terms.title;
      requestTermsRef.current.value = terms.terms;
      if (terms.stake) requestStakeRef.current.value = terms.stake;
    }
  }, []);

  return (
    <div>
      <h3 className="text-center my-1">Terms</h3>
      <div className="flex flex-col gap-2">
        <FormField
          label="Short title"
          name="title"
          placeholder="Bet short title..."
          ref={requestTitleRef}
        />
        <TextField
          label="Description"
          name="description"
          placeholder="Explanation what the bet stake is..."
          rows={4}
          className="resizable-y"
          ref={requestTermsRef}
        />
        <Select
          value={stakeType}
          onChange={(v) => setStakeType(v as StakeType)}
          placeholder="Select stake type...">
          <SelectItem value="COMMON">Common</SelectItem>
          <SelectItem value="INDIVIDUAL">Individual</SelectItem>
        </Select>
        {stakeType === "COMMON" && (
          <TextField
            label="Stake"
            name="stake"
            placeholder="When anybody win he..."
            rows={4}
            className="resizable-y"
            ref={requestStakeRef}
          />
        )}
      </div>
      <div className="flex gap-2 justify-center mt-4 w-full">
        <Button className="w-full" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="w-full" variant="primary" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
