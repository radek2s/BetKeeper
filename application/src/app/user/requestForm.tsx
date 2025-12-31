"use client";

import { Email } from "@domain/index";
import { sendUserRequest } from "../actions/createUser";

export function UserRequestCreateForm() {
  const handleSend = (f: FormData) => {
    const email = new Email(f.get("email")?.toString() || "");
    console.log(email);
    sendUserRequest({
      requesterId: f.get("requesterId")?.toString() || "",
      inviteeEmail: email.value,
    });
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
