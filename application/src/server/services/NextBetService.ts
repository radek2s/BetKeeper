import { BetService } from "@domain/bet";
import { NextBetParticipantRepository } from "../repositories/NextBetParticipantRepository";
import { NextBetRepository } from "../repositories/NextBetRepository";

const NextBetService = new BetService(
  new NextBetRepository(),
  new NextBetParticipantRepository(),
);

export default NextBetService;
