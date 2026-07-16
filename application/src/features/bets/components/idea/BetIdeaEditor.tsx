import { Button } from "@app/ui/button/Button";
import TextField from "@app/ui/text-field";
import { useState } from "react";
import type { BetIdeaType } from "../../model/betIdeaSchema";

interface Props {
  betIdea?: BetIdeaType;
  onClose: () => void;
  onSave: (content: string) => Promise<void>;
}
function BetIdeaEditor({ betIdea, onClose, onSave }: Props) {
  const [content, setContent] = useState<string>(betIdea?.content ?? "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onSave(content);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="idea-content editor">
      <TextField
        value={content}
        rows={6}
        onChange={(e) => setContent(e.target.value)}
        label="Content"
        name="content"
        placeholder="Friend should take photo with stranger..."
      />
      <div className="flex gap-2 justify-center mt-4 w-full">
        <Button
          className="w-full"
          onClick={() => {
            onClose();
          }}>
          Cancel
        </Button>
        <Button
          className="w-full"
          variant="primary"
          disabled={isLoading}
          onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default BetIdeaEditor;
