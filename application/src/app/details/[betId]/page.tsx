"use server";

import { getBet } from "@app/features/bets/actions";
import { BetRequestDetails } from "@app/features/bets/components/details/request/BetRequestDetails";
import { isBetResponse } from "@app/features/bets/model/betDto";
import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { Panel } from "@app/ui/layout/Panel";

interface PageProps {
  params: Promise<{ betId: string }>;
}
export default async function BetDetailsPage({ params }: PageProps) {
  const { betId } = await params;

  const bet = await getBet(betId);

  if (isBetResponse(bet)) {
    return <div>Bet</div>;
  } else {
    return (
      <PageWrapper>
        <PageHeader title="Details" returnUrl="/" />
        <Panel>
          <BetRequestDetails betRequest={bet} />
        </Panel>
      </PageWrapper>
    );
  }
}
