import { getRequest, sendRequest } from "@app/lib/utils/fetchUtils";
import { handleErrorResponse } from "@app/ui/api-handler/ApiErrorHandler";
import type {
  FeedbackIssueType,
  UserFeedbackAdminResponseSchemaType,
  UserFeedbackResponseType,
} from "../UserFeedbackSchema";

export async function fetchFeedback(): Promise<
  UserFeedbackAdminResponseSchemaType[]
> {
  const url = "/api/v1/admin/feedback";
  const res = await getRequest(url);
  if (!res.ok) throw new Error("Failed to fetch feedback");
  return res.json();
}

export async function saveUserFeedback(
  issueType: FeedbackIssueType,
  message: string,
): Promise<UserFeedbackResponseType> {
  const url = "/api/v1/user/feedback";
  const res = await sendRequest(url, "POST", { issueType, message });

  if (!res.ok) {
    await handleErrorResponse(res);
  }
  return res.json();
}

export async function deleteFeedback(feedbackId: string): Promise<void> {
  const url = `/api/v1/admin/feedback/${feedbackId}`;
  const res = await sendRequest(url, "DELETE");
  if (!res.ok) throw new Error("Failed to delete feedback");
}
