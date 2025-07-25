import { BetRequest } from "../../src/bet/entities/BetRequest";
import { IBetRequestRepository } from "../../src/bet/services/BetRepositories";
import { BetRequestStatus } from "../../src/bet/types/BetRequestStatus";
import { UUID } from "../../src/shared/Uuid";

export class InMemoryBetRequestRepository implements IBetRequestRepository {
  private betRequests: BetRequest[] = [];

  async findById(id: UUID): Promise<BetRequest | null> {
    return this.betRequests.find((betRequest) => betRequest.id === id) || null;
  }

  async findByParticipantId(participantId: UUID): Promise<BetRequest[]> {
    return this.betRequests.filter(
      (betRequest) => betRequest.participantId === participantId
    );
  }

  async findByCreatorId(creatorId: UUID): Promise<BetRequest[]> {
    return this.betRequests.filter(
      (betRequest) => betRequest.creatorId === creatorId
    );
  }

  async findByUserId(userId: UUID): Promise<BetRequest[]> {
    return this.betRequests.filter(
      (betRequest) => 
        betRequest.creatorId === userId || betRequest.participantId === userId
    );
  }

  async findByStatus(status: BetRequestStatus): Promise<BetRequest[]> {
    return this.betRequests.filter((betRequest) => betRequest.status === status);
  }

  async findByUserIdAndStatus(userId: UUID, status: BetRequestStatus): Promise<BetRequest[]> {
    return this.betRequests.filter(
      (betRequest) => 
        (betRequest.creatorId === userId || betRequest.participantId === userId) &&
        betRequest.status === status
    );
  }

  async findPendingByUserId(userId: UUID): Promise<BetRequest[]> {
    return this.betRequests.filter(
      (betRequest) => 
        (betRequest.creatorId === userId || betRequest.participantId === userId) &&
        betRequest.isPending()
    );
  }

  async findRejectedByUserId(userId: UUID): Promise<BetRequest[]> {
    return this.betRequests.filter(
      (betRequest) => 
        (betRequest.creatorId === userId || betRequest.participantId === userId) &&
        betRequest.isRejected()
    );
  }

  async findPendingTooLong(daysThreshold: number): Promise<BetRequest[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
    
    return this.betRequests.filter(
      (betRequest) => 
        betRequest.isPending() && betRequest.createdAt < thresholdDate
    );
  }

  async save(betRequest: BetRequest): Promise<void> {
    const existingIndex = this.betRequests.findIndex(
      (br) => br.id === betRequest.id
    );
    
    if (existingIndex >= 0) {
      this.betRequests[existingIndex] = betRequest;
    } else {
      this.betRequests.push(betRequest);
    }
  }

  async delete(id: UUID): Promise<void> {
    this.betRequests = this.betRequests.filter((betRequest) => betRequest.id !== id);
  }

  async exists(id: UUID): Promise<boolean> {
    return this.betRequests.some((betRequest) => betRequest.id === id);
  }

  // Helper method for testing
  clear(): void {
    this.betRequests = [];
  }

  // Helper method for testing
  getAll(): BetRequest[] {
    return [...this.betRequests];
  }
}
