import type { UserType } from "@domain/user/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUser, updateUserName, updateUserProfileImage } from "./userApi";

const queryKeys = {
  activeUser: "activeUser",
} as const;

const mutationKeys = {
  updateProfileImage: "updateProfileImage",
} as const;

export function useUser() {
  return useQuery({
    queryKey: [queryKeys.activeUser],
    queryFn: fetchUser,
  });
}

export function useProfileImageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.updateProfileImage],
    mutationFn: (avatarUrl: string) => updateUserProfileImage(avatarUrl),
    onSuccess: (_, avatarUrl) => {
      queryClient.setQueryData([queryKeys.activeUser], (old: UserType) => ({
        ...old,
        avatarUrl: avatarUrl,
      }));
    },
  });
}

interface NameMutationType {
  firstName: string;
  lastName: string;
}

export function useProfileNameMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.updateProfileImage],
    mutationFn: ({ firstName, lastName }: NameMutationType) =>
      updateUserName(firstName, lastName),
    onSuccess: (_, { firstName, lastName }) => {
      console.log({ firstName, lastName });
      queryClient.setQueryData([queryKeys.activeUser], (old: UserType) => ({
        ...old,
        firstName,
        lastName,
      }));
    },
  });
}
