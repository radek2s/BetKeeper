import type { UUID } from "../../shared";
import { DomainService } from "../../shared/DomainService";
import type { IEventDispatcher } from "../../shared/EventDispatcher";
import {
  type AbstractBet,
  type BetParticipant,
  CommonBet,
  IndividualBet,
  type IndividualBetParticipantType,
  IndividualBetRequest,
} from "../entities";
import {
  type AbstractBetRequest,
  CommonBetRequest,
} from "../entities/BetRequest";
import {
  getBetFromRecord,
  getBetRequestFromRecord,
  participantToRecord,
} from "../persistence/BetMapper";
import type { IBetParticipantRepository } from "../persistence/BetParticipantRepository";
import type {
  BetTableRecord,
  IBetRepository,
} from "../persistence/BetRepository";

/**
 * Bet Domain Service
 * Handles complex business operations involving multiple aggregates,
 * bet request approval flow, and bet lifecycle management
 */

export type BetParticipantRequest = {
  userId: UUID;
  claim: string;
  stake?: string;
};
export class BetService extends DomainService {
  constructor(
    private readonly betRepository: IBetRepository,
    private readonly betParticipantRepository: IBetParticipantRepository,
    eventDispatcher?: IEventDispatcher,
  ) {
    super(eventDispatcher);
  }

  async create(
    title: string,
    terms: string,
    creatorId: UUID,
    participants: BetParticipantRequest[],
    stake?: string,
  ): Promise<AbstractBetRequest> {
    const request = stake
      ? await this.createCommonBetRequest(
          title,
          terms,
          creatorId,
          participants,
          stake,
        )
      : await this.createIndividualBetRequest(
          title,
          terms,
          creatorId,
          participants,
        );

    await this.dispatchDomainEvents(request);
    return request;
  }

  private async createCommonBetRequest(
    title: string,
    terms: string,
    creatorId: UUID,
    participants: BetParticipantRequest[],
    stake: string,
  ): Promise<CommonBetRequest> {
    const mappedParticipants = participantRequestToCommon(
      participants,
      creatorId,
    );
    const request = new CommonBetRequest(
      creatorId,
      title,
      terms,
      stake,
      mappedParticipants,
    );

    const { participants: betParticipants, ...bet } = request.toObject();

    //Persist
    await this.betRepository.save(bet);
    betParticipants.forEach(async (participant) => {
      await this.betParticipantRepository.save(
        participantToRecord(participant, bet.id),
      );
    });

    return request;
  }

  private async createIndividualBetRequest(
    title: string,
    terms: string,
    creatorId: UUID,
    participants: BetParticipantRequest[],
  ): Promise<IndividualBetRequest> {
    const mappedParticipants = participantRequestToIndividual(
      participants,
      creatorId,
    );
    const request = new IndividualBetRequest(
      creatorId,
      title,
      terms,
      mappedParticipants,
    );

    const { participants: betParticipants, ...bet } = request.toObject();

    //Persist
    await this.betRepository.save(bet);
    betParticipants.forEach(async (participant) => {
      await this.betParticipantRepository.save(
        participantToRecord(participant, bet.id),
      );
    });

    return request;
  }

  async updateTitle(
    betRequestId: UUID,
    newTitle: string,
    updatedById: UUID,
  ): Promise<AbstractBetRequest> {
    const betRequest = await this.getBetRequestById(betRequestId);
    betRequest.setTitle(newTitle, updatedById);

    const { participants, ...bet } = betRequest.toObject();
    await this.betRepository.save(bet as BetTableRecord);
    participants.forEach(async (participant) => {
      await this.betParticipantRepository.save(
        participantToRecord(participant, bet.id),
      );
    });

    await this.dispatchDomainEvents(betRequest);

    return betRequest;
  }

  async updateTerms(
    betRequestId: UUID,
    newTerms: string,
    updatedById: UUID,
  ): Promise<AbstractBetRequest> {
    const betRequest = await this.getBetRequestById(betRequestId);
    betRequest.setTerms(newTerms, updatedById);

    const { participants, ...bet } = betRequest.toObject();
    await this.betRepository.save(bet as BetTableRecord);
    participants.forEach(async (participant) => {
      await this.betParticipantRepository.save(
        participantToRecord(participant, bet.id),
      );
    });

    await this.dispatchDomainEvents(betRequest);

    return betRequest;
  }

  async updateClaims(
    betRequestId: UUID,
    newClaims: string,
    updatedById: UUID,
  ): Promise<AbstractBetRequest> {
    const betRequest = await this.getBetRequestById(betRequestId);
    betRequest.setClaims(newClaims, updatedById);

    const { participants, ...bet } = betRequest.toObject();
    await this.betRepository.save(bet as BetTableRecord);
    participants.forEach(async (participant) => {
      await this.betParticipantRepository.save(
        participantToRecord(participant, bet.id),
      );
    });

    await this.dispatchDomainEvents(betRequest);

    return betRequest;
  }

  async updateStakes(
    betRequestId: UUID,
    newStakes: string,
    updatedById: UUID,
  ): Promise<AbstractBetRequest> {
    const betRequest = await this.getBetRequestById(betRequestId);
    betRequest.setStake(newStakes, updatedById);

    const { participants, ...bet } = betRequest.toObject();
    await this.betRepository.save(bet as BetTableRecord);
    if (betRequest instanceof IndividualBetRequest) {
      participants.forEach(async (participant) => {
        await this.betParticipantRepository.save(
          participantToRecord(participant, bet.id),
        );
      });
    }

    await this.dispatchDomainEvents(betRequest);

    return betRequest;
  }

  async approve(
    betRequestId: UUID,
    participantId: UUID,
  ): Promise<AbstractBetRequest> {
    const betRequest = await this.getBetRequestById(betRequestId);
    betRequest.approve(participantId);

    const { participants, ...bet } = betRequest.toObject();
    await this.betRepository.save(bet as BetTableRecord);
    participants.forEach(async (participant) => {
      await this.betParticipantRepository.save(
        participantToRecord(participant, bet.id),
      );
    });

    await this.dispatchDomainEvents(betRequest);

    return betRequest;
  }

  async reject(
    betRequestId: UUID,
    participantId: UUID,
  ): Promise<AbstractBetRequest> {
    const betRequest = await this.getBetRequestById(betRequestId);
    betRequest.reject(participantId);

    const { participants, ...bet } = betRequest.toObject();
    await this.betRepository.save(bet as BetTableRecord);
    participants.forEach(async (participant) => {
      await this.betParticipantRepository.save(
        participantToRecord(participant, bet.id),
      );
    });

    await this.dispatchDomainEvents(betRequest);

    return betRequest;
  }

  async convertToBet(betRequestId: UUID): Promise<AbstractBet> {
    const betRequest = await this.getBetRequestById(betRequestId);

    const bet = this.getBetFromRequest(betRequest);

    const { participants, ...betRecord } = bet.toObject();
    await this.betRepository.save(betRecord as BetTableRecord);

    await this.dispatchDomainEvents(betRequest);

    return bet;
  }

  // Bet Operations
  async resolve(
    betId: UUID,
    resolvedById: UUID,
    winnerId: UUID,
    dueDate?: Date,
  ): Promise<AbstractBet> {
    const bet = await this.getBetById(betId);
    bet.resolve(resolvedById, winnerId, dueDate);

    const { participants, ...betRecord } = bet.toObject();
    await this.betRepository.save(betRecord);

    await this.dispatchDomainEvents(bet);

    return bet;
  }

  async complete(betId: UUID, completedById: UUID): Promise<AbstractBet> {
    const bet = await this.getBetById(betId);
    bet.complete(completedById);

    const { participants, ...betRecord } = bet.toObject();
    await this.betRepository.save(betRecord);

    await this.dispatchDomainEvents(bet);

    return bet;
  }

  private getBetFromRequest(betRequest: AbstractBetRequest): AbstractBet {
    if (betRequest instanceof CommonBetRequest) {
      return new CommonBet(betRequest);
    } else if (betRequest instanceof IndividualBetRequest) {
      return new IndividualBet(betRequest);
    } else {
      throw new Error("Invalid request type");
    }
  }

  async updateDueDate(
    betId: UUID,
    newDueDate: Date | undefined,
  ): Promise<AbstractBet> {
    const bet = await this.getBetById(betId);
    bet.dueDate = newDueDate;

    const { participants, ...betRecord } = bet.toObject();
    await this.betRepository.save(betRecord);

    await this.dispatchDomainEvents(bet);

    return bet;
  }

  async deleteBet(
    betId: UUID,
    deletedById: UUID,
    isAdmin: boolean = false,
  ): Promise<void> {
    const bet = await this.getBetById(betId);
    if (!isAdmin && bet.creatorId !== deletedById)
      throw new Error("Only creator can delete bet");
    bet.delete(deletedById);

    const { participants, ...betRecord } = bet.toObject();
    await this.betRepository.save(betRecord);

    await this.dispatchDomainEvents(bet);
  }

  async deleteBetCompletly(
    betId: UUID,
    deletedById: UUID,
    isAdmin: boolean = false,
  ): Promise<void> {
    const bet = await this.getBetById(betId);
    if (!isAdmin) throw new Error("Only admin can delete bet completly");
    bet.delete(deletedById);

    await this.betRepository.delete(betId);

    await this.dispatchDomainEvents(bet);
  }

  async deleteBetRequest(
    betRequestId: UUID,
    deletedById: UUID,
    isAdmin: boolean = false,
  ): Promise<void> {
    const betRequest = await this.getBetRequestById(betRequestId);
    if (!isAdmin && betRequest.creatorId !== deletedById)
      throw new Error("Only creator can delete bet");

    await this.betRepository.delete(betRequestId);

    await this.dispatchDomainEvents(betRequest);
  }

  // Query Operations
  async getById(id: UUID): Promise<AbstractBetRequest | AbstractBet> {
    try {
      return await this.getBetById(id);
    } catch {
      try {
        return await this.getBetRequestById(id);
      } catch (e) {
        console.error(e);
        throw new Error(`Unable to find bet or betRequest with id=${id}`);
      }
    }
  }

  async getBetRequestById(betRequestId: UUID): Promise<AbstractBetRequest> {
    const betRecord = await this.betRepository.findById(betRequestId);
    if (!betRecord)
      throw new Error(`Bet request not found with ID: ${betRequestId}`);

    return this.getBetRequestFromRecord(betRecord);
  }

  async getBetById(betId: UUID): Promise<AbstractBet> {
    const betRecord = await this.betRepository.findById(betId);
    if (!betRecord) throw new Error(`Bet not found with ID: ${betId}`);

    return this.getBetFromRecord(betRecord);
  }

  async getAllByParticipantId(
    participantId: UUID,
  ): Promise<(AbstractBetRequest | AbstractBet)[]> {
    const participatedBets = (
      await this.betParticipantRepository.findAllByUserId(participantId)
    ).map(({ betId }) => betId);
    return await Promise.all(participatedBets.map(this.getById.bind(this)));
  }

  private async getBetRequestFromRecord(
    record: BetTableRecord,
  ): Promise<AbstractBetRequest> {
    return getBetRequestFromRecord(record, this.betParticipantRepository);
  }

  private async getBetFromRecord(record: BetTableRecord): Promise<AbstractBet> {
    return await getBetFromRecord(record, this.betParticipantRepository);
  }
}

function participantRequestToCommon(
  participants: BetParticipantRequest[],
  creatorId: UUID,
): BetParticipant[] {
  return participants.map((participant) => {
    if (participant.userId === creatorId) {
      return {
        userId: participant.userId,
        vote: "approved",
        claim: participant.claim,
      };
    }
    return {
      userId: participant.userId,
      vote: "unknown",
      claim: participant.claim,
    };
  });
}

function participantRequestToIndividual(
  participants: BetParticipantRequest[],
  creatorId: UUID,
): IndividualBetParticipantType[] {
  return participants.map((participant) => {
    if (!participant.stake)
      throw new Error("Participant must have defined stakes");
    if (participant.userId === creatorId) {
      return {
        userId: participant.userId,
        vote: "approved",
        claim: participant.claim,
        stake: participant.stake,
      };
    }
    return {
      userId: participant.userId,
      vote: "unknown",
      claim: participant.claim,
      stake: participant.stake,
    };
  });
}
