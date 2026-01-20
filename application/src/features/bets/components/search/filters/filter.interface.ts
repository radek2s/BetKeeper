import type {
  BetRequestResponse,
  BetResponse,
} from "@app/features/bets/model/betDto";

export type Bet = BetRequestResponse | BetResponse;

export type PipeFn<T> = (value: T) => T;

export function pipe<T>(value: T, ...fns: PipeFn<T>[]): T {
  return fns.reduce((acc, fn) => fn(acc), value);
}

export type BetSearchFilterType = (bet: Bet[]) => Bet[];
