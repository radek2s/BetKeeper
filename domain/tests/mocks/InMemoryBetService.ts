/** biome-ignore-all lint/complexity/noUselessConstructor: <explanation> */
import { BetService } from "../../src/bet/services/BetService";

import type { EventDispatcherMock } from "./EventDispatcherMock";
import type { InMemoryBetParticipantRepository } from "./InMemoryBetParticipantRepository";
import type { InMemoryBetRepository } from "./InMemoryBetRepository";

export class InMemoryBetService extends BetService {
  constructor(
    betRepository: InMemoryBetRepository,
    betParticipantRepository: InMemoryBetParticipantRepository,
    eventDispatcher: EventDispatcherMock,
  ) {
    super(betRepository, betParticipantRepository, eventDispatcher);
  }
}
