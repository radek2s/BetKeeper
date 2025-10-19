"use client";

import { createUser } from "../actions/createUser";

export function UserCreateForm() {
  const handleSend = (f: FormData) => {
    createUser({
      email: f.get("email")?.toString() || "",
      name: f.get("name")?.toString() || "",
    });
  };
  return (
    <form action={handleSend}>
      <input name="email" />
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  );
}
