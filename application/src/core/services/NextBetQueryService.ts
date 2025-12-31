import type {
  Bet,
  BetAggregate,
  BetQueryFilters,
  BetRequest,
  IBetQueryService,
} from "@domain/bet";
import type { UUID } from "@domain/shared";

export class NextBetQueryService implements IBetQueryService {
  queryBetRequests(filters: BetQueryFilters): Promise<BetRequest[]> {
    throw new Error("Method not implemented.");
  }
  queryBets(filters: BetQueryFilters): Promise<Bet[]> {
    throw new Error("Method not implemented.");
  }
  queryBetAggregates(filters: BetQueryFilters): Promise<BetAggregate[]> {
    throw new Error("Method not implemented.");
  }
  countBetRequests(filters: BetQueryFilters): Promise<number> {
    throw new Error("Method not implemented.");
  }
  countBets(filters: BetQueryFilters): Promise<number> {
    throw new Error("Method not implemented.");
  }
  getBetStatistics(userId: UUID): Promise<{
    totalBetRequests: number;
    pendingBetRequests: number;
    approvedBetRequests: number;
    rejectedBetRequests: number;
    totalBets: number;
    activeBets: number;
    completedBets: number;
    wonBets: number;
    lostBets: number;
  }> {
    throw new Error("Method not implemented.");
  }
}
