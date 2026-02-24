/** biome-ignore-all lint/performance/noImgElement: <explanation> */
"use client";

import { UserNotificationSettingsComponent } from "@app/features/notification/user/components/UserNotificationSettings";
import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";

export default async function NotificationsSettingsPage() {
  return (
    <PageWrapper>
      <PageHeader title="Notification settings" returnUrl="/profile" />
      <UserNotificationSettingsComponent />
    </PageWrapper>
  );
}
