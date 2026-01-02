"use client";
import { updateUserName } from "@app/features/users/actions";
import type { AuthorizedUser } from "@app/lib/user/AuthorizedUser";
import { Button } from "@app/ui/button/Button";
import { IconButton } from "@app/ui/button/IconButton";
import { Icon } from "@app/ui/icon";
import { Input } from "@app/ui/input/Input";
import { useCorbado } from "@corbado/react";
import type { UserType } from "@domain/user/entities";
import { useState } from "react";

interface Props {
  user: UserType;
}
export function UserNameEditor({ user }: Props) {
  const { sessionToken } = useCorbado();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(user.firstName);
  const [lastName, setLastName] = useState<string>(user.lastName);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = async () => {
    setIsLoading(true);
    try {
      await updateUserName(firstName, lastName, sessionToken);
      setEditMode(false);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  if (editMode)
    return (
      <div className="flex flex-col gap-1">
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <div className="flex gap-1">
          <Button className="w-full" onClick={() => setEditMode(false)}>
            Cancel <Icon name="close" />
          </Button>
          <Button
            className="w-full"
            variant="primary"
            isLoading={isLoading}
            onClick={handleChange}>
            Send <Icon name="send" />
          </Button>
        </div>
      </div>
    );
  return (
    <button
      type="button"
      className="text-xl m-none font-bold clickable hoverable px-2 py-1 rounded-lg"
      onClick={() => setEditMode(true)}>
      <h2>
        {user.firstName} {user.lastName}
      </h2>
    </button>
  );
}
