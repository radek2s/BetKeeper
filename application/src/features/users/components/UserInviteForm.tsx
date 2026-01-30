"use client";

import { IconButton } from "@app/ui/button/IconButton";
import { Input } from "@app/ui/input/Input";

import { useRef } from "react";
import { useUserCreateMutation } from "../api/userQuery";

export function UserInviteForm() {
  const { mutateAsync, isPending, error } = useUserCreateMutation();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleSend = async () => {
    try {
      if (!inputRef.current) return;
      const email = inputRef.current?.value.trim();
      if (!email) return;
      await mutateAsync(email);
      inputRef.current.value = "";
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <Input ref={inputRef} type="email" placeholder="Give email..." />
        <IconButton icon="send" onClick={handleSend} isLoading={isPending} />
      </div>
      {error && (
        <span role="alert" className="text-error">
          {error.message}
        </span>
      )}
    </div>
  );
}
