import { IFriendListRepository } from "../../src/user/services/UserService";
import { UUID } from "../../src/shared/Uuid";
import { UserFriendList } from "../../src/user/index";

export class InMemoryFriendListRepository implements IFriendListRepository {
  private friendLists: UserFriendList[] = [];

  async findByUserId(userId: UUID): Promise<UserFriendList | null> {
    return this.friendLists.find((list) => list.userId === userId) || null;
  }
  async save(friendList: UserFriendList): Promise<void> {
    const existingList = await this.findByUserId(friendList.userId);
    if (existingList) {
      this.friendLists = this.friendLists.map((list) =>
        list.userId === existingList.userId ? friendList : list,
      );
    } else {
      this.friendLists.push(friendList);
    }
  }
}
