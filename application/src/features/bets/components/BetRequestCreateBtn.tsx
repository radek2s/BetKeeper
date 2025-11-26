"use client";
import { Button } from "@app/ui/button/Button";
import { Icon } from "@app/ui/icon";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { BetRequestWizzard } from "./wizzard/BetRequestWizzard";

export function BetRequestCreateBtn() {
  const [isOpen, setOpen] = useState<boolean>(false);
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
          <BetRequestWizzard />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
