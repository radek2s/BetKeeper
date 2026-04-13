import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UserFeedbackAdminResponseSchemaType,
  UserFeedbackRequestType,
} from "../UserFeedbackSchema";
import {
  deleteFeedback,
  fetchFeedback,
  saveUserFeedback,
} from "./feedback.api";

export function useFeedback() {
  return useQuery({
    queryKey: ["user-feedback"],
    queryFn: fetchFeedback,
  });
}

export function useSaveUserFeedback() {
  return useMutation({
    mutationKey: ["user-feedback"],
    mutationFn: ({ issueType, message }: UserFeedbackRequestType) =>
      saveUserFeedback(issueType, message),
  });
}

export function useDeleteUserFeedback() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: ["user-feedback-delete"],
    mutationFn: deleteFeedback,
    onSuccess: (_, feedbackId) => {
      client.setQueryData(
        ["user-feedback"],
        (old: UserFeedbackAdminResponseSchemaType[]) =>
          old.filter(({ id }) => id !== feedbackId),
      );
    },
  });
}
