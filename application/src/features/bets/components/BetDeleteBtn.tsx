"use client";
import { IconButton } from "@app/ui/button/IconButton";
import { ConfirmationDialog } from "@app/ui/confirm-dialog";
import { useCorbado } from "@corbado/react";
import type { UserType } from "@domain/user/entities";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBet, deleteBetRequest } from "../actions";

interface Props {
  betId: string;
  activeUser: UserType;
  creatorId: string;
}
export function BetRequestDeleteBtn({ betId, activeUser, creatorId }: Props) {
  const { sessionToken } = useCorbado();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async (results: boolean) => {
    if (!results) return;
    setIsLoading(true);
    try {
      await deleteBetRequest(betId, sessionToken);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
    router.push("/");
  };

  if (
    activeUser.id === creatorId ||
    activeUser.role?.toLowerCase() === "administrator"
  ) {
    return (
      <ConfirmationDialog
        content="Do you want to delete this bet request? This operation remove bet irreversibly."
        title="Delete bet request?"
        variant="error"
        onClose={handleDelete}
        accept="Delete"
        isLoading={isLoading}>
        <IconButton icon="delete" isLoading={isLoading} />
      </ConfirmationDialog>
    );
  }

  return null;
}
export function BetDeleteBtn({ betId, activeUser, creatorId }: Props) {
  const { sessionToken } = useCorbado();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async (results: boolean) => {
    if (!results) return;
    setIsLoading(true);
    try {
      await deleteBet(betId, sessionToken);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
    router.push("/");
  };

  if (
    activeUser.id === creatorId ||
    activeUser.role?.toLowerCase() === "administrator"
  ) {
    return (
      <ConfirmationDialog
        content="Do you want to delete this bet?"
        title="Delete bet?"
        variant="error"
        onClose={handleDelete}
        accept="Delete"
        isLoading={isLoading}>
        <IconButton icon="delete" isLoading={isLoading} />
      </ConfirmationDialog>
    );
  }

  return null;
}
