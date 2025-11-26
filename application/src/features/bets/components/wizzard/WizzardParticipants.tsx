/** biome-ignore-all lint/performance/noImgElement: <explanation> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { Button } from "@app/ui/button/Button";
import FormField from "@app/ui/form-field";
import type { UserType } from "@domain/user/entities";
import { useMemo, useState } from "react";
import { UserItem } from "./UserItem";

interface Props {
  selectedFriend?: UserType;
  friends: UserType[];
  onBack: () => void;
  onNext: (friend: UserType) => void;
}
export function WizzardParticipants({
  selectedFriend,
  onBack,
  onNext,
  friends,
}: Props) {
  const [search, setSearch] = useState<string>("");
  const [_selectedFriend, setSelectedFriend] = useState<UserType | null>(
    selectedFriend || null,
  );

  const filteredUsers = useMemo(() => {
    const filteredFriends = friends.filter(
      ({ id }) => id !== _selectedFriend?.id,
    );
    if (search.length === 0) return filteredFriends;
    const searchText = search.toLowerCase();

    return filteredFriends.filter(
      (friend) =>
        friend.email.toLowerCase().includes(searchText) ||
        friend.firstName.toLowerCase().includes(searchText) ||
        friend.lastName.toLowerCase().includes(searchText),
    );
  }, [search, friends, _selectedFriend]);

  const handleSelect = (id: string) => {
    const friend = friends.find((friend) => friend.id === id);
    setSelectedFriend(friend || null);
  };

  const handleNext = () => {
    if (!_selectedFriend) return;
    onNext(_selectedFriend);
  };

  return (
    <div>
      <h3 className="text-center my-1">Participants</h3>

      <div className="flex flex-col gap-2">
        <FormField
          label="Select friend who you want to invite to bet"
          name="title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search friend..."
        />
        {_selectedFriend && (
          <>
            <span className="text-xs">Selected:</span>
            <UserItem user={_selectedFriend}>
              <input type="radio" value={_selectedFriend.id} checked={true} />
            </UserItem>
            <hr />
          </>
        )}
        {filteredUsers.map((friend) => (
          <button
            key={friend.id}
            type="button"
            className="w-full"
            onClick={() => handleSelect(friend.id)}>
            <UserItem user={friend}>
              <input
                type="radio"
                value={friend.id}
                checked={_selectedFriend?.id === friend.id}
              />
            </UserItem>
          </button>
        ))}
      </div>
      <div className="flex gap-2 justify-center mt-4 w-full">
        <Button className="w-full" onClick={onBack}>
          Back
        </Button>
        <Button
          disabled={!_selectedFriend}
          className="w-full"
          variant="primary"
          onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
