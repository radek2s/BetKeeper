import { useMutation } from "@tanstack/react-query";
import type { UserFeedbackRequestType } from "../UserFeedbackSchema";
import { saveUserFeedback } from "./feedback.api";

export function useSaveUserFeedback() {
  return useMutation({
    mutationKey: ["user-feedback"],
    mutationFn: ({ issueType, message }: UserFeedbackRequestType) =>
      saveUserFeedback(issueType, message),
  });
}
