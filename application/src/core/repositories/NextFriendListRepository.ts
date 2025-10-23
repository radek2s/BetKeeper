import type { UUID } from "@domain/shared";
import type { IFriendListRepository, UserFriendList } from "@domain/user";

export class NextFriendListRepository implements IFriendListRepository {
  findByUserId(userId: UUID): Promise<UserFriendList | null> {
    throw new Error("Method not implemented.");
  }
  save(friendList: UserFriendList): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
