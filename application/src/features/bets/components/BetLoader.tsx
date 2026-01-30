"use client";
import PageHeader from "@app/ui/layout/Header";
import { PageWrapper } from "@app/ui/layout/PageWrapper";
import { Panel } from "@app/ui/layout/Panel";
import type { ReactNode } from "react";
import { useBet, useBets } from "../api/betQuery";
import type { BetRequestResponse, BetResponse } from "../model/betDto";

interface Props {
  loader?: ReactNode;
  children: (bets: (BetResponse | BetRequestResponse)[]) => ReactNode;
}
export function BetLoader({ loader, children }: Props) {
  const { data, isLoading, error } = useBets();
  if (isLoading) return loader ? loader : <div>Loading bets...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!data) return <div>No data available</div>;

  return <>{children(data)}</>;
}

interface SingleBetLoaderProps {
  betId: string;
  children: (bet: BetResponse | BetRequestResponse) => ReactNode;
}
export function SingleBetLoader({ betId, children }: SingleBetLoaderProps) {
  const { data, isLoading, error } = useBet(betId);
  if (isLoading) return <BetDetailsLoader />;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!data) return <div>No data available</div>;

  return <>{children(data)}</>;
}

function BetDetailsLoader() {
  return (
    <PageWrapper>
      <PageHeader title="Loading details..." returnUrl="/" />
      <Panel className="panel-loading">
        <header className="flex gap-1 justify-between">
          <div className="skeleton h-[38px] w-[168px]" />
          <div className="skeleton h-[38px] w-[96px]" />
        </header>
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="skeleton h-[36px] w-[128px]" />
          <div className="skeleton h-[36px] w-[256px]" />
          <hr className="vertical-line" />
        </div>
        <div className="mt-2 flex flex-col items-center gap-1">
          <div className="skeleton h-[36px] w-[128px]" />
          <div className="skeleton h-[36px] w-[256px]" />
          <div className="my-2 flex gap-4 justify-between">
            <div className="flex flex-col gap-1 items-center">
              <div className="skeleton rounded h-[32px] w-[32px]" />
              <div className="skeleton h-[24px] w-[64px]" />
              <div className="skeleton h-[44px] w-[128px] mt-2" />
              <div className="skeleton h-[44px] w-[128px] mt-2" />
            </div>
            <hr className="vertical-line" />
            <div className="flex flex-col gap-1 items-center">
              <div className="skeleton rounded h-[32px] w-[32px]" />
              <div className="skeleton h-[24px] w-[64px]" />
              <div className="skeleton h-[44px] w-[128px] mt-2" />
              <div className="skeleton h-[44px] w-[128px] mt-2" />
            </div>
          </div>
          <div className="skeleton h-[36px] w-[128px]" />
          <div className="skeleton h-[36px] w-[256px]" />
        </div>
        <div />
      </Panel>
    </PageWrapper>
  );
}
