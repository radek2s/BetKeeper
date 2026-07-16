import { toRelativeTime } from "@app/lib/utils/timeUtils";
import { IconButton } from "@app/ui/button/IconButton";
import { Icon } from "@app/ui/icon";
import { DropdownMenu } from "radix-ui";
import { useState } from "react";
import { useDeleteBetIdea, useUpdateBetIdea } from "../../api/betIdea.query";
import type { BetIdeaType } from "../../model/betIdeaSchema";
import BetCreationDate from "../details/BetCreationDate";
import BetIdeaEditor from "./BetIdeaEditor";

interface Props {
  idea: BetIdeaType;
}
function BetIdeaCard({ idea }: Props) {
  const { createdAt, updatedAt, content } = idea;
  const [editMode, setEditMode] = useState<boolean>(false);
  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);
  const { mutateAsync: updateBetIdea } = useUpdateBetIdea(idea.id);
  const { mutateAsync: deleteBetIdea } = useDeleteBetIdea(idea.id);

  const handleSave = async (content: string) => {
    try {
      await updateBetIdea({ content });
      setEditMode(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBetIdea();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bet-idea-card flex flex-col gap-2">
      <header className="flex justify-between items-center bet-idea-card__header">
        <BetCreationDate date={createdDate} />
        <div className="flex gap-1 items-center">
          <BetIdeaUpdated updatedDate={updatedDate} createdDate={createdDate} />
          {!editMode && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <IconButton variant="ghost" icon="more" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="dropdown--content panel">
                  <DropdownMenu.Item
                    className="dropdown--item"
                    onClick={() => setEditMode(true)}>
                    Edit
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="dropdown--item"
                    onClick={handleDelete}>
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
        </div>
      </header>
      {editMode ? (
        <BetIdeaEditor
          betIdea={idea}
          onClose={() => setEditMode(false)}
          onSave={handleSave}
        />
      ) : (
        <div className="idea-content">{content}</div>
      )}
    </div>
  );
}

interface BetIdeaUpdatedProps {
  createdDate: Date;
  updatedDate: Date;
}
function BetIdeaUpdated({ createdDate, updatedDate }: BetIdeaUpdatedProps) {
  if (createdDate.getTime() === updatedDate.getTime()) return null;
  return (
    <div className="flex flex-col justify-end text-right bet-idea-card__updated text-xs">
      <span>Updated</span>
      <span>{toRelativeTime(updatedDate).join(" ")} ago</span>
    </div>
  );
}

export default BetIdeaCard;
