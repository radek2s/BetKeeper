"use client";

// import { createUserRequest } from "@app/features/users/actions";
import { IconButton } from "@app/ui/button/IconButton";
import { Input } from "@app/ui/input/Input";
import { useCorbado } from "@corbado/react";

import { useRef, useState } from "react";

export function UserInviteForm() {
  const { sessionToken } = useCorbado();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSend = async () => {
    try {
      setError(null);
      if (!inputRef.current) return;
      const email = inputRef.current?.value.trim();
      if (!email) return;
      // await createUserRequest(email, sessionToken);
      inputRef.current.value = "";
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <Input ref={inputRef} type="email" placeholder="Give email..." />
        <IconButton icon="send" onClick={handleSend} />
      </div>
      {error && (
        <span role="alert" className="text-error">
          {error}
        </span>
      )}
    </div>
  );
}
