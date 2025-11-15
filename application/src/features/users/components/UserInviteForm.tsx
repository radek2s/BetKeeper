"use client";

import { createUserRequest } from "@app/features/users/actions";
import { IconButton } from "@app/ui/button/IconButton";
import { Input } from "@app/ui/input/Input";
import { ACTIVE_USER_ID } from "application/src/constants";

import { useRef } from "react";

export function UserInviteForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSend = async () => {
    try {
      if (!inputRef.current) return;
      const email = inputRef.current?.value.trim();
      if (!email) return;
      await createUserRequest({
        requesterId: ACTIVE_USER_ID,
        inviteeEmail: email,
      });
      inputRef.current.value = "";
    } catch (e) {}
  };
  return (
    <div className="flex gap-1">
      <Input ref={inputRef} type="email" placeholder="Give email..." />
      <IconButton icon="send" onClick={handleSend} />
    </div>
  );
}
