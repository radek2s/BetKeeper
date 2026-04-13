"use client";
import { useDeleteUserFeedback } from "@app/features/feedback/api/feedback.query";
import FeedbackLoader from "@app/features/feedback/components/FeedbackLoader";
import FeedbackTable from "@app/features/feedback/components/FeedbackTable";
import { UserPageHeader } from "@app/features/users/components/UsersPageHeader";
import { useUserContext } from "@app/features/users/UserProvider";
import { MissingPrivileges } from "@app/ui/error-pages/MissingPrivileges";
import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { Panel } from "@app/ui/layout/Panel";

export default function FeedbackPage() {
  const user = useUserContext();
  const { mutateAsync: deleteFeedback } = useDeleteUserFeedback();
  const handleSeen = async (itemId: string) => {
    await deleteFeedback(itemId);
  };

  if (user.role !== "ADMINISTRATOR")
    return (
      <PageWrapper>
        <UserPageHeader />
        <MissingPrivileges />
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <PageHeader title={"Feedback"} returnUrl="/profile"></PageHeader>
      <Panel>
        <FeedbackLoader>
          {(items) => (
            <FeedbackTable feedbackItems={items} feedbackSeen={handleSeen} />
          )}
        </FeedbackLoader>
      </Panel>
    </PageWrapper>
  );
}
