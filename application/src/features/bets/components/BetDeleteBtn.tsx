"use client";
import { IconButton } from "@app/ui/button/IconButton";
import { ConfirmationDialog } from "@app/ui/confirm-dialog";
import type { UserType } from "@domain/user/entities";
import { useRouter } from "next/navigation";
import { useBetDeleteMutation } from "../api/betQuery";

interface Props {
  betId: string;
  activeUser: UserType;
  creatorId: string;
}
export function BetRequestDeleteBtn({ betId, activeUser, creatorId }: Props) {
  const router = useRouter();

  const { mutateAsync, isPending } = useBetDeleteMutation(betId);

  const handleDelete = async (results: boolean) => {
    if (!results) return;

    try {
      await mutateAsync();
    } catch (e) {
      console.error(e);
    }

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
        isLoading={isPending}>
        <IconButton icon="delete" isLoading={isPending} />
      </ConfirmationDialog>
    );
  }

  return null;
}
export function BetDeleteBtn({ betId, activeUser, creatorId }: Props) {
  const router = useRouter();
  const { mutateAsync, isPending } = useBetDeleteMutation(betId);

  const handleDelete = async (results: boolean) => {
    if (!results) return;
    try {
      await mutateAsync();
    } catch (e) {
      console.error(e);
    }

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
        isLoading={isPending}>
        <IconButton icon="delete" isLoading={isPending} />
      </ConfirmationDialog>
    );
  }

  return null;
}
