import type { UUID } from "@domain/shared";
import { NextFriendListRepository } from "application/src/core/repositories/NextFriendListRepository";
import NextUserRepository from "application/src/core/repositories/NextUserRepository";
import Link from "next/link";
import { approveFriendRequest } from "../../actions/friendListActions";
import { FriendRequestItem } from "./FreindRequestItem";
import { FriendRequestForm } from "./FriendRequestForm";

interface UserDetailsProps {
  params: { userId: string };
}
export default async function User({ params }: UserDetailsProps) {
  const { userId } = await params;
  const userRepository = new NextUserRepository();
  const userFriendRepository = new NextFriendListRepository();

  const user = await userRepository.findById(userId);
  const friendList = await userFriendRepository.findByUserId(userId);

  if (user)
    return (
      <div>
        <h2>{user.name}</h2>
        <FriendRequestForm userId={user.id} />
        <div>
          {friendList && (
            <div>
              <h3>Friends</h3>
              <ul>
                {friendList?.friends.map((friend) => (
                  <div key={friend}>
                    <Link href={`/user/${friend}`}>{friend}</Link>
                  </div>
                ))}
              </ul>

              <h3>Send requests</h3>
              <ul>
                {friendList?.sentFriendRequests.map((request) => (
                  <span key={request.id}>{request.id}</span>
                ))}
              </ul>

              <h3>Recived requests</h3>
              <ul>
                {friendList?.receivedFriendRequests.map((request) => (
                  <FriendRequestItem
                    userId={user.id}
                    request={request.toObject()}
                    key={request.id}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );

  return <div>User with {userId} was not found!</div>;
}
