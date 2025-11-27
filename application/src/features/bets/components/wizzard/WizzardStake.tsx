import { Button } from "@app/ui/button/Button";

import { Select, SelectItem } from "@app/ui/select";
import TextField from "@app/ui/text-field";
import { StakeType } from "@domain/bet";
import { useRef, useState } from "react";
import type { StakeResult } from "./types";

interface Props {
  selectedFriendName: string;
  onCancel: () => void;
  onSend: (result: StakeResult) => void;
}
export function WizzardStake({ selectedFriendName, onCancel, onSend }: Props) {
  const [stakeType, setStakeType] = useState<string>(
    StakeType.COMMON.toString(),
  );

  const commonStakeRef = useRef<HTMLTextAreaElement>(null);
  const userStakeRef = useRef<HTMLTextAreaElement>(null);
  const friendStakeRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (stakeType === "common") {
      const value = commonStakeRef.current?.value;
      if (!value) return;
      onSend({ type: "common", stake: value });
    } else {
      const userStake = userStakeRef.current?.value;
      const friendStake = friendStakeRef.current?.value;
      if (!userStake) return;
      if (!friendStake) return;
      onSend({ type: "individual", userStake, friendStake });
    }
  };

  return (
    <div>
      <h3 className="text-center my-1">Stakes</h3>
      <div className="flex flex-col gap-2">
        <Select
          value={stakeType}
          onChange={(v) => setStakeType(v)}
          placeholder="Select stake type...">
          <SelectItem value="common">Common</SelectItem>
          <SelectItem value="individual">Individual</SelectItem>
        </Select>
        {stakeType === StakeType.COMMON ? (
          <TextField
            label="Stake"
            name="stake"
            placeholder="When anybody loose he has to..."
            rows={4}
            className="resizable-y"
            ref={commonStakeRef}
          />
        ) : (
          <>
            <TextField
              label="Your stakes"
              name="your"
              placeholder={`When you win what ${selectedFriendName} should do?`}
              rows={4}
              className="resizable-y"
              ref={userStakeRef}
            />
            <TextField
              label={`${selectedFriendName} stakes`}
              name="description"
              placeholder={`When ${selectedFriendName} win what you should do?`}
              rows={4}
              className="resizable-y"
              ref={friendStakeRef}
            />
          </>
        )}
      </div>
      <div className="flex gap-2 justify-center mt-4 w-full">
        <Button className="w-full" onClick={onCancel}>
          Back
        </Button>
        <Button className="w-full" variant="primary" onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
}
