"use client";

import { Email } from "@domain/index";

export function UserRequestCreateForm() {
  const handleSend = (f: FormData) => {
    const email = new Email(f.get("email")?.toString() || "");
    console.log(email);
  };
  return (
    <form action={handleSend}>
      Send request
      <input name="email" placeholder="email" />
      <input name="requesterId" placeholder="requesterId" />
      <button type="submit">Create</button>
    </form>
  );
}
