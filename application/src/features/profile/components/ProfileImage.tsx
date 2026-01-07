"use client";
import { useProfileImageMutation } from "@app/lib/user/api/userQuery";
import { Button } from "@app/ui/button/Button";

import { Dialog } from "radix-ui";
import { useState } from "react";

const AVATAR_MAX_ID = 8;

interface Props {
  activeImage: string;
}
export function ProfileImage({ activeImage }: Props) {
  const [selectedImage, setSelectedImage] = useState<string>(activeImage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mutateAsync } = useProfileImageMutation();
  const avatarIds = [...Array(AVATAR_MAX_ID).keys()].map(
    (id) => `/avatars/avatar_0${id}.png`,
  );
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await mutateAsync(selectedImage);
      // await updateAvatar(selectedImage, sessionToken);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };
  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <img
            src={activeImage}
            className="avatar w-[128px] h-[128px] clickable"
            alt="Profile"
          />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog--overlay" />
          <Dialog.Content className="dialog--content">
            <Dialog.Title className="dialog--title">Choose image</Dialog.Title>
            <div className="flex flex-wrap justify-center">
              {avatarIds.map((avatar) => (
                <button
                  aria-controls="content"
                  type="button"
                  onClick={() => setSelectedImage(avatar)}
                  key={avatar}
                  name={avatar}
                  className={`avatar-preview w-1/4 m-2 ${avatar === selectedImage ? "active" : ""}`}>
                  <img src={avatar} alt={avatar} />
                </button>
              ))}
            </div>

            <div className="flex mt-6 justify-center gap-2">
              <Dialog.Close asChild>
                <Button>Cancel</Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  isLoading={isLoading}>
                  Save
                </Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
