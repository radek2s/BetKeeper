import { BetService } from "@domain/bet";
import { ServerDispatcher } from "../events/EventDispatcher";
import { NextBetParticipantRepository } from "../repositories/NextBetParticipantRepository";
import { NextBetRepository } from "../repositories/NextBetRepository";

const NextBetService = new BetService(
  new NextBetRepository(),
  new NextBetParticipantRepository(),
  ServerDispatcher,
);

export default NextBetService;
