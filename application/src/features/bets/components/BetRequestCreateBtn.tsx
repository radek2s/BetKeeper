"use client";
import { Button } from "@app/ui/button/Button";
import { Icon } from "@app/ui/icon";
import { useCorbado } from "@corbado/react";
import type { UserType } from "@domain/user/entities";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { createBetRequest } from "../actions";
import { BetRequestWizzard } from "./wizzard/BetRequestWizzard";
import type { BetRequestCreate } from "./wizzard/types";

interface Props {
  friends: UserType[];
}
export function BetRequestCreateBtn({ friends }: Props) {
  const { sessionToken } = useCorbado();
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleSend = async (request: BetRequestCreate) => {
    try {
      await createBetRequest(request, sessionToken);
      setOpen(false);
    } catch {
      console.error("Failed to create bet request");
    }
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <div className="btn-fab">
          <Button variant="primary">
            <span>Add bet</span>
            <Icon name="add" />
          </Button>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog--overlay" />
        <Dialog.Content className="dialog--content">
          <Dialog.Title className="dialog--title">
            Create bet request
          </Dialog.Title>
          <BetRequestWizzard
            onCancel={() => setOpen(false)}
            onSend={handleSend}
            friends={friends}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
