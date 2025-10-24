import type { UUID } from "@domain/shared";
import {
  Email,
  type IInvitationRequestRepository,
  RequestStatus,
  UserRequest,
} from "@domain/user";
import type { IUserRequestRepository } from "@domain/user/services/UserService";
import prisma from "application/src/lib/prisma";

export class NextUserRequestRepository
  implements IUserRequestRepository, IInvitationRequestRepository
{
  private table = prisma.userRequestTable;

  async findById(id: UUID): Promise<UserRequest | null> {
    const userRequest = await this.table.findUnique({ where: { id } });
    if (!userRequest) return null;

    return UserRequest.reconstitute(
      userRequest.id,
      userRequest.requesterId,
      new Email(userRequest.inviteeEmail),
      userRequest.status as RequestStatus,
      userRequest.createdAt,
      userRequest.approvedById ?? undefined,
      userRequest.approvedAt ?? undefined,
    );
  }

  async findPendingByEmail(email: Email): Promise<UserRequest[]> {
    const userRequestEntities = await this.table.findMany({
      where: {
        OR: [{ status: RequestStatus.PENDING }, { inviteeEmail: email.value }],
      },
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
  async save(request: UserRequest): Promise<void> {
    try {
      const requestEntity = await this.findById(request.id);
      if (requestEntity) {
        this.table.update({
          where: { id: requestEntity.id },
          data: {
            status: request.status,
            createdAt: request.createdAt,
            approvedAt: request.approvedAt,
            approvedById: request.approvedById,
          },
        });
      } else {
        this.table.create({
          data: {
            id: request.id,
            requesterId: request.requesterId,
            inviteeEmail: request.inviteeEmail.value,
            status: request.status,
            createdAt: request.createdAt,
            approvedAt: request.approvedAt,
            approvedById: request.approvedById,
          },
        });
      }
      //TODO update when exisits
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
