import { Button } from "@app/ui/button/Button";
import { Icon } from "@app/ui/icon";
import clsx from "clsx";
import { Dialog } from "radix-ui";
import { type ReactNode, useMemo, useState } from "react";

type FeedbackTopicType = "IMPROVEMENT" | "BUG";
type FeedbackProviderType = "GITHUB" | "EMAIL";

interface Props {
  emailProviderAvailable?: boolean;
}
function FeedbackDialog({ emailProviderAvailable }: Props) {
  const [topic, setTopic] = useState<FeedbackTopicType>("IMPROVEMENT");
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

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="flex items-center gap-2">
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
            {emailProviderAvailable && (
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
            )}
            <Dialog.Close asChild>
              {provider === "GITHUB" ? (
                <a href={getLink} target="_blank" rel="noopener">
                  <Button variant={"primary"}>Open</Button>
                </a>
              ) : (
                <Button variant={"primary"}>Send</Button>
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
