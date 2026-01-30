import type { UserType } from "@domain/user/entities";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys as adminQueryKeys } from "./adminUserQuery";
import {
  createUserRequest,
  fetchUser,
  updateUserName,
  updateUserProfileImage,
} from "./userApi";

const queryKeys = {
  activeUser: "activeUser",
} as const;

const mutationKeys = {
  createUserRequest: "createUserRequest",
  updateProfileImage: "updateProfileImage",
} as const;

export function useUser() {
  return useQuery({
    queryKey: [queryKeys.activeUser],
    queryFn: fetchUser,
    retry: false,
  });
}

export function useUserCreateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.createUserRequest],
    mutationFn: createUserRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({
        queryKey: [adminQueryKeys.usersRequests],
      });
    },
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
      queryClient.setQueryData([queryKeys.activeUser], (old: UserType) => ({
        ...old,
        firstName,
        lastName,
      }));
    },
  });
}
