import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BetIdeaType } from "../model/betIdeaSchema";
import {
  deleteBetIdea,
  fetchBetIdeas,
  saveBetIdea,
  updateBetIdea,
} from "./betIdea.api";

const queryKeys = {
  fetchAll: "bet-ideas",
  create: "bet-ideas-create",
  update: "bet-ideas-update",
  delete: "bet-ideas-delete",
} as const;

export function useBetIdeas() {
  return useQuery({
    queryKey: [queryKeys.fetchAll],
    queryFn: fetchBetIdeas,
  });
}

export function useCreateBetIdea() {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [queryKeys.create],
    mutationFn: ({ content }: { content: string }) => saveBetIdea(content),
    onSuccess: (data) => {
      client.setQueryData([queryKeys.fetchAll], (old: BetIdeaType[]) => [
        ...old,
        data,
      ]);
    },
  });
}
export function useUpdateBetIdea(id: string) {
  const client = useQueryClient();

  return useMutation({
    mutationKey: [queryKeys.update],
    mutationFn: ({ content }: { content: string }) =>
      updateBetIdea(id, content),
    onSuccess: (data) => {
      client.setQueryData([queryKeys.fetchAll], (old: BetIdeaType[]) => [
        ...old.filter(({ id }) => data.id !== id),
        data,
      ]);
    },
  });
}

export function useDeleteBetIdea(ideaId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: () => deleteBetIdea(ideaId),
    onSuccess: () => {
      client.setQueryData([queryKeys.fetchAll], (old: BetIdeaType[]) =>
        old.filter(({ id }) => ideaId !== id),
      );
    },
  });
}
