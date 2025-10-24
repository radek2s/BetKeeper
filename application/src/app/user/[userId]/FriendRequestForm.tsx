"use client";

import { Email } from "@domain/user";
import { useRef, useState } from "react";
import { sendFriendRequest } from "../../actions/friendListActions";

interface Props {
  userId: string;
}
export function FriendRequestForm({ userId }: Props) {
  const [isError, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    setError(null);
    const emailValue = emailRef.current?.value ?? "";
    let email: Email;

    try {
      email = new Email(emailValue);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
    try {
      await sendFriendRequest(userId, email!.value);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) setError(e.message);
    }
  };

  return (
    <div>
      <input ref={emailRef} />
      <button type="button" onClick={handleSend}>
        Send friend request
      </button>
      {isError && <div>{isError}</div>}
    </div>
  );
}
