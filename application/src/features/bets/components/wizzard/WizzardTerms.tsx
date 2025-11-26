/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { Button } from "@app/ui/button/Button";
import FormField from "@app/ui/form-field";
import TextField from "@app/ui/text-field";
import { useEffect, useRef } from "react";
import type { TermsResult } from "./types";

interface Props {
  terms?: TermsResult;
  onCancel: () => void;
  onNext: (result: TermsResult) => void;
}
export function WizzardTerms({ terms, onCancel, onNext }: Props) {
  const requestTitleRef = useRef<HTMLInputElement>(null);
  const requestDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const handleNext = () => {
    const title = requestTitleRef.current?.value;
    if (!title) return;
    const description = requestDescriptionRef.current?.value;
    onNext({
      title,
      description,
    });
  };

  useEffect(() => {
    if (terms && requestTitleRef.current && requestDescriptionRef.current) {
      requestTitleRef.current.value = terms.title;
      if (terms.description)
        requestDescriptionRef.current.value = terms.description;
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
          ref={requestDescriptionRef}
        />
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
