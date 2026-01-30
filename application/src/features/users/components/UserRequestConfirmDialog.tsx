"use client";

import { Button } from "@app/ui/button/Button";
import { IconButton } from "@app/ui/button/IconButton";
import FormField from "@app/ui/form-field";
import { Dialog } from "radix-ui";
import { useRef, useState } from "react";

export type UserRequestData = {
  firstName: string;
  lastName: string;
};

interface Props {
  onClose: (data: UserRequestData | null) => Promise<void>;
}
export function UserRequestConfirmDialog({ onClose }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  const handleCreate = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setError(null);
    const firstName = firstNameRef.current?.value.trim();
    if (!firstName) {
      setError("First name must not be blank!");
      return;
    }
    const lastName = lastNameRef.current?.value.trim();
    if (!lastName) {
      setError("Last name must not be blank!");
      return;
    }

    try {
      setIsLoading(true);
      await onClose({ firstName, lastName });
      setIsOpen(false);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
    setIsLoading(false);
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <IconButton icon="check" variant="ghost" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog--overlay" />
        <Dialog.Content className="dialog--content">
          <Dialog.Title className="dialog--title">Setup user</Dialog.Title>
          <div className="flex flex-col gap-2">
            <FormField name="firstName" label="First name" ref={firstNameRef} />
            <FormField name="lastName" label="Last name" ref={lastNameRef} />
            {error && <div className="text-error">{error}</div>}
            <div className="flex mt-6 justify-center gap-2">
              <Dialog.Close asChild>
                <Button>Cancel</Button>
              </Dialog.Close>
              <Button
                variant="primary"
                isLoading={isLoading}
                onClick={(e) => handleCreate(e)}>
                Create
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
