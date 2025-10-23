import type { UUID } from "@domain/shared";
import { Email, RequestStatus, UserRequest } from "@domain/user";
import type { IUserRequestRepository } from "@domain/user/services/UserService";
import prisma from "application/src/lib/prisma";

export class NextUserRequestRepository implements IUserRequestRepository {
  private table = prisma.userRequestTable;

  async findAllPending(): Promise<UserRequest[]> {
    const userRequestEntities = await this.table.findMany({
      where: { status: RequestStatus.PENDING },
    });

    return userRequestEntities.map((entity) =>
      UserRequest.reconstitute(
        entity.id,
        entity.requesterId,
        new Email(entity.inviteeEmail),
        entity.status as RequestStatus,
        entity.createdAt,
        entity.approvedById ?? undefined,
        entity.approvedAt ?? undefined,
      ),
    );
  }
  async findByUserId(userId: UUID): Promise<UserRequest | null> {
    const userRequestEntity = await this.table.findFirst({
      where: { requesterId: userId },
    });
    if (userRequestEntity) {
      return UserRequest.reconstitute(
        userRequestEntity.id,
        userRequestEntity.requesterId,
        new Email(userRequestEntity.inviteeEmail),
        userRequestEntity.status as RequestStatus,
        userRequestEntity.createdAt,
        userRequestEntity.approvedById ?? undefined,
        userRequestEntity.approvedAt ?? undefined,
      );
    }
    return null;
  }
  async save(friendList: UserRequest): Promise<void> {
    try {
      //TODO update when exisits
      this.table.create({
        data: {
          id: friendList.id,
          requesterId: friendList.requesterId,
          inviteeEmail: friendList.inviteeEmail.value,
          status: friendList.status,
          createdAt: friendList.createdAt,
        },
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
