"use client";

import { ACTIVE_USER_ID } from "application/src/constants";
import { Button } from "application/src/lib/components/button/Button";
import { IconButton } from "application/src/lib/components/button/IconButton";
import { Input } from "application/src/lib/components/input/Input";
import { useRef } from "react";
import { createUserRequest } from "../actions/usersActions";

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
