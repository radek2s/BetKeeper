import { sendRequest } from "@app/lib/utils/fetchUtils";
import { handleErrorResponse } from "@app/ui/api-handler/ApiErrorHandler";
import type {
  FeedbackIssueType,
  UserFeedbackResponseType,
} from "../UserFeedbackSchema";

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
