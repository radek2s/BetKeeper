"use server";

import { getBet } from "@app/features/bets/actions";
import {
  BetDeleteBtn,
  BetRequestDeleteBtn,
} from "@app/features/bets/components/BetDeleteBtn";

import { PendingBetDetails } from "@app/features/bets/components/details/bet/PendingBetDetails";
import { ResolvedBetDetails } from "@app/features/bets/components/details/bet/ResolvedBetDetails";
import { BetRequestDetails } from "@app/features/bets/components/details/request/BetRequestDetails";
import { isBetResponse } from "@app/features/bets/model/betDto";
import { authorizedUserToUserType } from "@app/features/users/model/userDto";
import { getAuthenticatedUserFromCookie } from "@app/server/auth/authentication";
import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { Panel } from "@app/ui/layout/Panel";

interface PageProps {
  params: Promise<{ betId: string }>;
}
export default async function BetDetailsPage({ params }: PageProps) {
  const user = await getAuthenticatedUserFromCookie();
  const { betId } = await params;

  const bet = await getBet(betId);

  if (!user) return <div>User not logged in!</div>;

  if (isBetResponse(bet)) {
    return (
      <PageWrapper>
        <PageHeader title={bet.title} returnUrl="/">
          <BetDeleteBtn
            betId={bet.id}
            activeUser={authorizedUserToUserType(user)}
            creatorId={bet.creatorId}
          />
        </PageHeader>
        <Panel>
          {bet.status === "pending" && <PendingBetDetails bet={bet} />}
          {(bet.status === "resolved" || bet.status === "completed") && (
            <ResolvedBetDetails
              bet={bet}
              activeUser={authorizedUserToUserType(user)}
            />
          )}
        </Panel>
      </PageWrapper>
    );
  } else {
    return (
      <PageWrapper>
        <PageHeader title={bet.title} returnUrl="/">
          <BetRequestDeleteBtn
            betId={bet.id}
            activeUser={authorizedUserToUserType(user)}
            creatorId={bet.creatorId}
          />
        </PageHeader>
        <Panel>
          <BetRequestDetails
            betRequest={bet}
            activeUser={authorizedUserToUserType(user)}
          />
        </Panel>
      </PageWrapper>
    );
  }
}
