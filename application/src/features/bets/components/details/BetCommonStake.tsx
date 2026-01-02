import { IconButton } from "@app/ui/button/IconButton";
import { Input } from "@app/ui/input/Input";
import { useCorbado } from "@corbado/react";
import { useState } from "react";
import { updatedBetRequestStake } from "../../actions";

interface CommonStakesProps {
  betRequestId?: string;
  stake: string;
}
function BetCommonStake({ betRequestId, stake }: CommonStakesProps) {
  const { sessionToken } = useCorbado();
  const isEditable = !!betRequestId;
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newStake, setNewStake] = useState<string>(stake);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClose = () => {
    setNewStake(stake);
    setEditMode(false);
  };

  const handleUpdate = async () => {
    if (!betRequestId) return;
    setIsLoading(true);
    try {
      await updatedBetRequestStake(betRequestId, newStake, sessionToken);
      handleClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-bold">Stakes</h2>
      <p className="text-xs text-gray">when anyone win he:</p>
      {isEditable ? (
        editMode ? (
          <div className="flex gap-1">
            <Input
              value={newStake}
              onChange={(e) => setNewStake(e.target.value)}
            />
            <IconButton icon="close" onClick={handleClose} />
            <IconButton
              icon="send"
              variant="primary"
              onClick={handleUpdate}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <button
            type="button"
            className="my-3 clickable hoverable px-2 py-1 rounded-lg"
            onClick={() => setEditMode(true)}>
            {stake}
          </button>
        )
      ) : (
        <p className="my-3">{stake}</p>
      )}
      <hr className="vertical-line" />
    </div>
  );
}

export default BetCommonStake;
