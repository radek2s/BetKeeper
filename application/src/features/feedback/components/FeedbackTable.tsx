import { Icon } from "@app/ui/icon";
import { useState } from "react";
import type { UserFeedbackAdminResponseSchemaType } from "../UserFeedbackSchema";

interface Props {
  feedbackItems: UserFeedbackAdminResponseSchemaType[];
  feedbackSeen: (itemId: string) => Promise<void>;
}
function FeedbackTable({ feedbackItems, feedbackSeen }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <table className="feedback-table">
        <thead className="text-sm text-left">
          <tr>
            <th>Type</th>
            <th>Created at</th>
            <th>Created by</th>
            <th style={{ width: "200px", wordWrap: "break-word" }}>Message</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {feedbackItems.map((item) => (
            <FeedbackTableRow
              key={item.id}
              feedback={item}
              onClick={() => feedbackSeen(item.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface FeedbackTableRowProps {
  feedback: UserFeedbackAdminResponseSchemaType;
  onClick?: () => Promise<void>;
}
function FeedbackTableRow({ feedback, onClick }: FeedbackTableRowProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { createdAt, createdBy, issueType, message, seen } = feedback;
  const icon =
    issueType === "BUG" ? <Icon name="bug" /> : <Icon name="app-add" />;

  const handleClick = async () => {
    if (!onClick) return;
    try {
      setIsLoading(true);
      await onClick();
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <tr className="feedback-table-row">
      {isLoading ? (
        <td colSpan={4}>Please wait...</td>
      ) : (
        <>
          <td className="feedback-table-cell">
            <button type="button" onClick={handleClick}>
              {icon}
            </button>
          </td>
          <td>{new Date(createdAt).toLocaleString()}</td>
          <td>{createdBy.name}</td>
          <td>{message}</td>
        </>
      )}
    </tr>
  );
}

export default FeedbackTable;
