"use client";
import type { ReactNode } from "react";
import { useBet, useBets } from "../api/betQuery";
import type { BetRequestResponse, BetResponse } from "../model/betDto";

interface Props {
  children: (bets: (BetResponse | BetRequestResponse)[]) => ReactNode;
}
export function BetLoader({ children }: Props) {
  const { data, isLoading, error } = useBets();
  if (isLoading) return <div>Loading...</div>;
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
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;
  if (!data) return <div>No data available</div>;

  return <>{children(data)}</>;
}
