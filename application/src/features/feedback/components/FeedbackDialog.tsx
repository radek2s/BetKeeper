import { Button } from "@app/ui/button/Button";
import { Icon } from "@app/ui/icon";
import { TextArea } from "@app/ui/input/TextArea";
import clsx from "clsx";
import { Dialog } from "radix-ui";
import { type ReactNode, useMemo, useState } from "react";
import type {
  FeedbackIssueType,
  UserFeedbackRequestType,
} from "../UserFeedbackSchema";

type FeedbackProviderType = "GITHUB" | "EMAIL";

interface Props {
  onSave: (feedback: UserFeedbackRequestType) => Promise<void>;
}
function FeedbackDialog({ onSave }: Props) {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [topic, setTopic] = useState<FeedbackIssueType>("IMPROVEMENT");
  const [message, setMessage] = useState<string>();
  const [provider, setProvider] = useState<FeedbackProviderType>("GITHUB");

  const getLink = useMemo(() => {
    switch (topic) {
      case "IMPROVEMENT":
        return "https://github.com/radek2s/BetKeeper/issues/new?template=02-report-idea.yml";
      case "BUG":
        return "https://github.com/radek2s/BetKeeper/issues/new?template=01-report-bug.yml";
      default:
        throw new Error("Unsuppoerted topic type!");
    }
  }, [topic]);

  const handleSend = async () => {
    if (!topic) return;
    if (!message) return;
    try {
      await onSave({ issueType: topic, message });
      setMessage(undefined);
      setProvider("GITHUB");
      setTopic("IMPROVEMENT");
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 cursor-pointer">
          <Icon name="bug" /> Send feedback
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog--overlay" />
        <Dialog.Content className="dialog--content feedback-dialog">
          <Dialog.Title className="dialog--title">Send feedback</Dialog.Title>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-2 w-full mb-6">
              <p>Choose topic</p>
              <div className="flex w-full">
                <FeedbackButton
                  title="Suggest improvement"
                  icon={<Icon name="app-add" />}
                  active={topic === "IMPROVEMENT"}
                  onClick={() => setTopic("IMPROVEMENT")}
                />
                <FeedbackButton
                  title="Report problem"
                  icon={<Icon name="bug" />}
                  active={topic === "BUG"}
                  onClick={() => setTopic("BUG")}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 w-full">
              <p>Feedback form</p>
              <div className="flex w-full">
                <FeedbackButton
                  title="GitHub Issues"
                  icon={<Icon name="github" />}
                  active={provider === "GITHUB"}
                  onClick={() => setProvider("GITHUB")}
                />
                <FeedbackButton
                  title="Private feedback"
                  icon={<Icon name="mail" />}
                  active={provider === "EMAIL"}
                  onClick={() => setProvider("EMAIL")}
                />
              </div>
            </div>

            {provider === "EMAIL" && (
              <div className="w-full flex flex-col gap-1">
                <label htmlFor="message-content" className="text-sm">
                  Message
                </label>
                <TextArea
                  id="message-content"
                  className="w-full"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            )}

            <Dialog.Close asChild>
              {provider === "GITHUB" ? (
                <a href={getLink} target="_blank" rel="noopener">
                  <Button variant={"primary"}>Open</Button>
                </a>
              ) : (
                <Button variant={"primary"} onClick={handleSend}>
                  Send
                </Button>
              )}
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface FeedbackButtonProps {
  icon: ReactNode;
  title: string;
  active?: boolean;
  onClick: () => void;
}
function FeedbackButton({ icon, title, active, onClick }: FeedbackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx([
        "feedback-btn w-1/2 flex flex-col items-center gap-1",
        { active },
      ])}>
      {icon}
      <span>{title}</span>
    </button>
  );
}

export default FeedbackDialog;
