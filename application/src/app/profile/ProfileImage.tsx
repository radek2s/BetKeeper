"use client";
import { Button } from "application/src/lib/components/button/Button";
import { Dialog } from "radix-ui";
import { useState } from "react";

const AVATAR_MAX_ID = 7;

interface Props {
  activeImage: string;
}
export function ProfileImage({ activeImage }: Props) {
  const [selectedImage, setSelectedImage] = useState<string>(activeImage);
  const avatarIds = [...Array(AVATAR_MAX_ID).keys()].map(
    (id) => `/avatars/avatar_0${id}.png`,
  );
  return (
    <div>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <img src={activeImage} className="avatar w-[128px]" />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog--overlay" />
          <Dialog.Content className="dialog--content">
            <Dialog.Title className="dialog--title">Choose image</Dialog.Title>
            <Dialog.Description>Whats up</Dialog.Description>
            <div className="flex flex-wrap justify-center">
              {avatarIds.map((avatar) => (
                <button
                  aria-controls="content"
                  type="button"
                  onClick={() => setSelectedImage(avatar)}
                  key={avatar}
                  className={`avatar-preview w-1/4 m-2 ${avatar === selectedImage ? "active" : ""}`}>
                  <img src={avatar} alt={avatar} />
                </button>
              ))}
            </div>
            <Dialog.Close asChild>
              <Button variant="primary">Save</Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
