"use client";
import BetIdeaCreator from "@app/features/bets/components/idea/BetIdeaCreator";
import BetIdeaList from "@app/features/bets/components/idea/BetIdeaList";
import BetIdeaLoader from "@app/features/bets/components/idea/BetIdeaLoader";
import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { Panel } from "@app/ui/layout/Panel";

export default function IdeaPage() {
  return (
    <PageWrapper>
      <PageHeader title="Bet ideas" returnUrl="/profile"></PageHeader>
      <div className="flex flex-col gap-4">
        <Panel className="bet-idea-panel">
          <BetIdeaCreator />
        </Panel>

        <Panel className="bet-idea-panel">
          <BetIdeaLoader>
            {(data) => <BetIdeaList betIdeas={data} />}
          </BetIdeaLoader>
        </Panel>
      </div>
    </PageWrapper>
  );
}
