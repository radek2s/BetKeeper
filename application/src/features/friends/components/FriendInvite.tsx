"use client";
import { Button } from "@app/ui/button/Button";
import FormField from "@app/ui/form-field";
import { Icon } from "@app/ui/icon";
import { useCorbado } from "@corbado/react";
import { Dialog } from "radix-ui";
import { useRef, useState } from "react";
import { sendFriendRequest } from "../actions";

export function FriendInvite() {
  const { sessionToken } = useCorbado();
  const [isOpen, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const friendEmailRef = useRef<HTMLInputElement>(null);

  const handleInvitation = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setError(null);
    e.preventDefault();
    const email = friendEmailRef.current?.value.trim();
    if (!email) return;

    try {
      await sendFriendRequest(email, sessionToken);

      setOpen(false);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
      console.error("Failed to send friend request", e);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="btn-fab">
          <Button variant="primary">
            <span>Invite</span>
            <Icon name="group-add" />
          </Button>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog--overlay" />
        <Dialog.Content className="dialog--content">
          <Dialog.Title className="dialog--title">Invite friend</Dialog.Title>
          <div className="flex flex-col gap-2">
            <FormField
              name="firstName"
              label="Friend email"
              ref={friendEmailRef}
            />
            {error && (
              <span role="alert" className="text-error">
                {error}
              </span>
            )}
            <div className="flex mt-6 justify-center gap-2">
              <Dialog.Close asChild>
                <Button>Cancel</Button>
              </Dialog.Close>
              <Button variant="primary" onClick={handleInvitation}>
                Invite
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
