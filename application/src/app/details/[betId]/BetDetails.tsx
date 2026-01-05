"use client";

import {
  BetDeleteBtn,
  BetRequestDeleteBtn,
} from "@app/features/bets/components/BetDeleteBtn";
import { SingleBetLoader } from "@app/features/bets/components/BetLoader";
import { PendingBetDetails } from "@app/features/bets/components/details/bet/PendingBetDetails";
import { ResolvedBetDetails } from "@app/features/bets/components/details/bet/ResolvedBetDetails";
import { BetRequestDetails } from "@app/features/bets/components/details/request/BetRequestDetails";
import { isBetResponse } from "@app/features/bets/model/betDto";
import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { Panel } from "@app/ui/layout/Panel";
import type { UserType } from "@domain/user/entities";

interface Props {
  betId: string;
  activeUser: UserType;
}
function BetDetails({ betId, activeUser }: Props) {
  return (
    <SingleBetLoader betId={betId}>
      {(bet) => {
        if (isBetResponse(bet)) {
          return (
            <PageWrapper>
              <PageHeader title={bet.title} returnUrl="/">
                <BetDeleteBtn
                  betId={bet.id}
                  activeUser={activeUser}
                  creatorId={bet.creatorId}
                />
              </PageHeader>
              <Panel>
                {bet.status === "pending" && <PendingBetDetails bet={bet} />}
                {(bet.status === "resolved" || bet.status === "completed") && (
                  <ResolvedBetDetails bet={bet} activeUser={activeUser} />
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
                  activeUser={activeUser}
                  creatorId={bet.creatorId}
                />
              </PageHeader>
              <Panel>
                <BetRequestDetails betRequest={bet} activeUser={activeUser} />
              </Panel>
            </PageWrapper>
          );
        }
      }}
    </SingleBetLoader>
  );
}
export default BetDetails;
