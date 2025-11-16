"use client";
import { Icon } from "@app/ui/icon";
import { useCorbado } from "@corbado/react";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const { logout, loading } = useCorbado();

  const router = useRouter();

  const onLogout = async () => {
    if (loading) return;
    await logout();
    router.push("/login");
  };

  return (
    <button type="button" onClick={onLogout}>
      <li className="flex items-center gap-2">
        <Icon name="logout" /> Logout
      </li>
    </button>
  );
}

export default LogoutButton;
