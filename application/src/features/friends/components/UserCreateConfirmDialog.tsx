import { Button } from "@app/ui/button/Button";
import { Dialog } from "radix-ui";

interface Props {
  isOpen: boolean;
  email?: string;
  isLoading?: boolean;
  onClose: (result: boolean) => void;
}
export function UserCreateConfirmDialog({
  isOpen,
  isLoading,
  email,
  onClose,
}: Props) {
  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog--overlay" />
        <Dialog.Content className="dialog--content">
          <Dialog.Title className="dialog--title">Create user?</Dialog.Title>
          <div className="flex flex-col items-center">
            <div className="text-center">
              User <strong>{email}</strong> is not a user of BetKeeper.
              <br /> Do you want to continue and send user request to
              application administrator who will create account for your friend?
            </div>
            <div className="flex mt-6 items-center gap-2">
              <Dialog.Close asChild>
                <Button
                  onClick={() => {
                    onClose(false);
                  }}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button
                  variant={"primary"}
                  onClick={() => onClose(true)}
                  isLoading={isLoading}>
                  Send user request
                </Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
