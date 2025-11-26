import { Button } from "@app/ui/button/Button";
import FormField from "@app/ui/form-field";
import { Select } from "@app/ui/select";
import TextField from "@app/ui/text-field";

interface Props {
  selectedFriendName: string;
  onCancel: () => void;
}
export function WizzardStake({ selectedFriendName, onCancel }: Props) {
  return (
    <div>
      <h3 className="text-center my-1">Stakes</h3>
      <div className="flex flex-col gap-2">
        <Select />
        {/* <FormField label="Stake type" name="type" /> */}
        <TextField
          label="Your stakes"
          name="your"
          placeholder={`When you win what ${selectedFriendName} should do?`}
          rows={4}
          className="resizable-y"
        />
        <TextField
          label={`${selectedFriendName} stakes`}
          name="description"
          placeholder={`When ${selectedFriendName} win what you should do?`}
          rows={4}
          className="resizable-y"
        />
      </div>
      <div className="flex gap-2 justify-center mt-4 w-full">
        <Button className="w-full" onClick={onCancel}>
          Back
        </Button>
        <Button className="w-full" variant="primary">
          Send
        </Button>
      </div>
    </div>
  );
}
