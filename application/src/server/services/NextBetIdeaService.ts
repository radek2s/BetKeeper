import { BetIdeaService } from "@domain/bet/services/BetIdeaService";
import { ServerDispatcher } from "../events/EventDispatcher";
import { NextBetIdeaRepository } from "../repositories/NextBetIdeaRepository";
import NextUserRepository from "../repositories/NextUserRepository";

const NextBetIdeaService = new BetIdeaService(
  new NextBetIdeaRepository(),
  new NextUserRepository(),
  ServerDispatcher,
);

export default NextBetIdeaService;
