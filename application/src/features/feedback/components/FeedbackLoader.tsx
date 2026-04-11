import type { ReactNode } from "react";
import { useFeedback } from "../api/feedback.query";
import type { UserFeedbackAdminResponseSchemaType } from "../UserFeedbackSchema";

interface Props {
  children: (feedbackItems: UserFeedbackAdminResponseSchemaType[]) => ReactNode;
}
function FeedbackLoader({ children }: Props) {
  const { data, isLoading, error } = useFeedback();

  if (isLoading) return <div>Loading feedback messages...</div>;

  if (error) return <div>Failed to load feedback messages.</div>;

  if (!data) return <div>No feedback data</div>;

  return children(data);
}

export default FeedbackLoader;
