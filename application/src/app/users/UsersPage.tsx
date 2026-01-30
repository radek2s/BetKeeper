"use client";

import {
  useActiveUsers,
  usePendingUserRequests,
} from "@app/features/users/api/adminUserQuery";
import UsersManageClient from "@app/features/users/components/UsersManageClient";

import { UserPageHeader } from "@app/features/users/components/UsersPageHeader";
import { useUserContext } from "@app/features/users/UserProvider";
import type { UserRequestWithRequester } from "@app/lib/mappers/user";
import { MissingPrivileges } from "@app/ui/error-pages/MissingPrivileges";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import type { UserType } from "@domain/user/entities";
import type { ReactNode } from "react";

export default function ClientUsersPage() {
  const user = useUserContext();

  if (user.role !== "ADMINISTRATOR")
    return (
      <PageWrapper>
        <UserPageHeader />
        <MissingPrivileges />
      </PageWrapper>
    );

  return (
    <ActiveUserLoader>
      {(users) => (
        <PendingUserRequestLoader>
          {(requests) => (
            <UsersManageClient users={users} pendingRequests={requests} />
          )}
        </PendingUserRequestLoader>
      )}
    </ActiveUserLoader>
  );
}

interface ActiveUserLoaderProps {
  children: (users: UserType[]) => ReactNode;
}
function ActiveUserLoader({ children }: ActiveUserLoaderProps) {
  const { data, isLoading, error } = useActiveUsers();

  if (isLoading) return <div>Fetching application users</div>;
  if (error) return <div>{error.message}</div>;
  if (!data) return <div>No data</div>;

  return children(data);
}

interface PendingUserRequestLoaderProps {
  children: (users: UserRequestWithRequester[]) => ReactNode;
}
function PendingUserRequestLoader({ children }: PendingUserRequestLoaderProps) {
  const { data, isLoading, error } = usePendingUserRequests();

  if (isLoading) return <div>Fetching pending requests</div>;
  if (error) return <div>{error.message}</div>;
  if (!data) return <div>No data</div>;

  return children(data);
}
