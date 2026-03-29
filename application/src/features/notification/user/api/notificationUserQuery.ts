import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserNotificationSettings,
  saveUserNotificationSettings,
} from "./notificationUserApi";

const queryKeys = {
  userNotificationSettings: "user_notification_settings",
} as const;

const mutationKeys = {
  saveUserNotificationSettings: "save_user_notification_settings",
} as const;

export function useUserNotificationSettings() {
  return useQuery({
    queryKey: [queryKeys.userNotificationSettings],
    queryFn: fetchUserNotificationSettings,
    retry: false,
  });
}

export function useSaveUserNotificationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [mutationKeys.saveUserNotificationSettings],
    mutationFn: saveUserNotificationSettings,
    onSuccess: (result) => {
      queryClient.setQueryData([queryKeys.userNotificationSettings], () => ({
        ...result,
      }));
    },
  });
}
