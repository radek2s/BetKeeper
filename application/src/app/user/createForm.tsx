"use client";

import { Email } from "@domain/index";
import { createUser } from "../actions/createUser";

export function UserCreateForm() {
  const handleSend = (f: FormData) => {
    const email = new Email(f.get("email")?.toString() || "");
    console.log(email);
    createUser({
      email: email.value,
      firstName: f.get("firstName")?.toString() || "",
      lastName: f.get("lastName")?.toString() || "",
    });
  };
  return (
    <form action={handleSend}>
      <input name="email" placeholder="email" />
      <input name="firstName" placeholder="firstName" />
      <input name="lastName" placeholder="lastName" />
      <button type="submit">Create</button>
    </form>
  );
}
