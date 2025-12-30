/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { Button } from "@app/ui/button/Button";
import FormField from "@app/ui/form-field";
import { Select, SelectItem } from "@app/ui/select";
import TextField from "@app/ui/text-field";
import type { StakeType } from "@domain/bet";
import { useMemo, useState } from "react";
import type { TermsResult } from "./types";

interface Props {
  terms?: TermsResult;
  onCancel: () => void;
  onNext: (result: TermsResult) => void;
}
export function WizzardTerms({ terms, onCancel, onNext }: Props) {
  const [title, setTitle] = useState<string>(terms?.title || "");
  const [description, setDescription] = useState<string>(terms?.terms || "");
  const [stakeType, _setStakeType] = useState<StakeType>(
    terms?.stakeType || "INDIVIDUAL",
  );
  const [stake, setStake] = useState<string | undefined>(terms?.stake);

  const setStakeType = (stakeType: string) => {
    if (stakeType === "COMMON") {
      _setStakeType("COMMON");
    } else {
      setStake(undefined);
      _setStakeType("INDIVIDUAL");
    }
  };

  const handleNext = () => {
    onNext({
      title,
      terms: description,
      stakeType,
      stake,
    });
  };

  const isValid = useMemo(() => {
    const isValidStake = stakeType === "COMMON" ? !!stake : true;
    return !!title && !!description && isValidStake;
  }, [title, description, stake, stakeType]);

  return (
    <div className="mt-4">
      <h3 className="text-center mb-2">Terms</h3>
      <div className="flex flex-col gap-2">
        <FormField
          value={title}
          label="Short title"
          name="title"
          placeholder="Bet short title..."
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          value={description}
          label="Description"
          name="description"
          placeholder="Explanation what the bet stake is..."
          rows={4}
          className="resizable-y"
          onChange={(e) => setDescription(e.target.value)}
        />
        <Select
          label="Stake type"
          name="stakeType"
          value={stakeType}
          onChange={(v) => setStakeType(v)}
          placeholder="Select stake type...">
          <SelectItem value="COMMON">Common</SelectItem>
          <SelectItem value="INDIVIDUAL">Individual</SelectItem>
        </Select>
        {stakeType === "COMMON" && (
          <TextField
            value={stake}
            label="Stake"
            name="stake"
            placeholder="When anybody win he..."
            rows={4}
            className="resizable-y"
            onChange={(e) => setStake(e.target.value)}
          />
        )}
      </div>
      <div className="flex gap-2 justify-center mt-4 w-full">
        <Button className="w-full" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="w-full"
          variant="primary"
          disabled={!isValid}
          onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
