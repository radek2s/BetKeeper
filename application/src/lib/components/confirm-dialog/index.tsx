"use client";

import { Dialog } from "radix-ui";
import type { PropsWithChildren, ReactNode } from "react";
import { Button } from "../button/Button";

interface Props extends PropsWithChildren {
  title: string;
  content: ReactNode;
  cancel?: ReactNode;
  accept?: ReactNode;
  onClose: (accepted: boolean) => void;
}
export function ConfirmationDialog({
  title,
  content,
  accept,
  cancel,
  onClose,
  children,
}: Props) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog--overlay" />
        <Dialog.Content className="dialog--content">
          <Dialog.Title className="dialog--title">{title}</Dialog.Title>
          <div className="flex flex-col items-center">
            <div className="my-2">{content}</div>
            <div className="flex items-center">
              <Dialog.Close asChild>
                <Button
                  onClick={() => {
                    onClose(false);
                  }}>
                  {cancel ?? "Cancel"}
                </Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button variant="primary" onClick={() => onClose(true)}>
                  {accept ?? "Accept"}
                </Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
