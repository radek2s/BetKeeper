"use client";

import { useRef, useState } from "react";
import { createBetRequest } from "../../actions/createBet";

interface Props {
  userId: string;
}
export function BetCreateForm({ userId }: Props) {
  const [error, setError] = useState<string | null>(null);
  const participantInputRef = useRef<HTMLInputElement>(null);
  const termsInputRef = useRef<HTMLInputElement>(null);

  const send = async () => {
    setError(null);
    const participantId = participantInputRef.current?.value || "";
    const terms = termsInputRef.current?.value || "";
    try {
      await createBetRequest(userId, participantId, terms);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
  };

  return (
    <div>
      <input placeholder="Participant Id" ref={participantInputRef} />
      <input placeholder="Terms" ref={termsInputRef} />
      <button type="button" onClick={send}>
        Send bet request
      </button>
      {error && <div>{error}</div>}
    </div>
  );
}
