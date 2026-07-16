import { DomainService, type IEventDispatcher } from "@domain/shared";
import { DomainError } from "@domain/shared/DomainError";
import type { IUserRepository } from "@domain/user";
import { BetIdea } from "../entities/BetIdea";
import { domainToRecord, recordToDomain } from "../persistence/BetIdeaMapper";
import type { IBetIdeaRepository } from "../persistence/BetIdeaRepository";

export class BetIdeaService extends DomainService {
  constructor(
    private readonly betIdeaRepository: IBetIdeaRepository,
    private readonly userRepository: IUserRepository,
    eventDispatcher?: IEventDispatcher,
  ) {
    super(eventDispatcher);
  }

  async getAll(userId: string): Promise<BetIdea[]> {
    return (await this.betIdeaRepository.findAllByUserId(userId)).map(
      (record) => recordToDomain(record),
    );
  }

  async create(userId: string, content: string): Promise<BetIdea> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new DomainError(`User ${userId} does not exists!`);
    const betIdea = new BetIdea(userId, content);
    await this.betIdeaRepository.save(domainToRecord(betIdea));
    return betIdea;
  }

  async update(ideaId: string, content: string): Promise<BetIdea> {
    const betIdeaRecord = await this.betIdeaRepository.findById(ideaId);
    if (!betIdeaRecord)
      throw new DomainError(`Bet Idea ${ideaId} does not exists!`);
    const betIdea = recordToDomain(betIdeaRecord);
    betIdea.content = content;
    this.betIdeaRepository.save(domainToRecord(betIdea));
    return betIdea;
  }

  async delete(userId: string, ideaId: string, isAdmin?: boolean) {
    if (!isAdmin) {
      const betIdea = await this.betIdeaRepository.findById(ideaId);
      if (betIdea?.userId !== userId)
        throw new DomainError("Only creator can delete bet idea!");
    }
    await this.betIdeaRepository.delete(ideaId);
  }
}
