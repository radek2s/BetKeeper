"use client";
import { Button } from "@app/ui/button/Button";
import FormField from "@app/ui/form-field";
import { useState } from "react";

function getUserId() {
  return (
    localStorage.getItem("active-user-id") ??
    process.env.NEXT_PUBLIC_USER_ID ??
    ""
  );
}

function DevUserSwitch() {
  const [userId, setUserId] = useState<string>(getUserId());

  const changeUser = async () => {
    try {
      if (!userId) throw new Error("User Id must not be null!");
      localStorage.setItem("active-user-id", userId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-1 m-4  w-[350px]">
      <FormField
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        label="Active user identifier"
        name="userId"
      />
      <Button variant="primary" onClick={changeUser}>
        Change user
      </Button>
    </div>
  );
}
export default DevUserSwitch;
