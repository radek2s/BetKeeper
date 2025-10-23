import { NextFriendListRepository } from "application/src/core/repositories/NextFriendListRepository";
import NextUserRepository from "application/src/core/repositories/NextUserRepository";
import Link from "next/link";

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
        <div>
          {(friendList?.friendCount || 0) > 0 ? (
            <div>
              <h3>Friends</h3>
              <ul>
                {friendList?.friends.map((friend) => (
                  <Link href={`/user/${friend}`} key={friend}>
                    {friend}
                  </Link>
                ))}
              </ul>

              <h3>Send requests</h3>
              <ul>
                {friendList?.sentFriendRequests.map((request) => (
                  <li key={request.id}>
                    <span>{request.receiverId}</span>
                  </li>
                ))}
              </ul>

              <h3>Recived requests</h3>
              <ul>
                {friendList?.receivedFriendRequests.map((request) => (
                  <li key={request.id}>
                    <span>{request.senderId}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>You do not have friends yet. Try invite new!</div>
          )}
        </div>
      </div>
    );

  return <div>User with {userId} was not found!</div>;
}
