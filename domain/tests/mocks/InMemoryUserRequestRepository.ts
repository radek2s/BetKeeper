import { UUID } from "@domain/shared/Uuid";
import { UserRequest } from "@domain/user/entities/UserRequest";
import { IUserRequestRepository } from "@domain/user/services/UserService";

export class InMemoryUserRequestRepository implements IUserRequestRepository {
  private requests: UserRequest[] = [];

  async findAllPending(): Promise<UserRequest[]> {
    return this.requests.filter((request) => request.isPending());
  }
  async findByUserId(userId: UUID): Promise<UserRequest | null> {
    return (
      this.requests.find(({ requesterId }) => requesterId === userId) || null
    );
  }
  async save(friendList: UserRequest): Promise<void> {
    const existingRequest = this.requests.find(
      ({ id }) => id === friendList.id,
    );
    if (existingRequest) {
      this.requests = this.requests.map((request) =>
        request.id === existingRequest.id ? friendList : request,
      );
    } else {
      this.requests.push(friendList);
    }
  }
}
