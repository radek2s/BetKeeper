import { BetService } from "@domain/bet";
import { NextBetAggregateRepository } from "../repositories/NextBetAggregateRepository";
import { NextBetQueryService } from "./NextBetQueryService";

const NextBetService = new BetService(
  new NextBetAggregateRepository(),
  new NextBetQueryService(),
);

export default NextBetService;
