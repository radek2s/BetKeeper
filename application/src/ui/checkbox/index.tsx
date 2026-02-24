import { Checkbox as RadixCheckbox } from "radix-ui";
import type { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  id: string;
  checked: boolean;
  defaultChecked?: boolean;
  onCheckedChange: (checked: boolean) => void;
}
export function Checkbox({
  id,
  checked,
  onCheckedChange,
  defaultChecked,
  children,
}: Props) {
  return (
    <div className="flex gap-2 items-center checkbox__wrapper">
      <RadixCheckbox.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        id={id}
        defaultChecked={defaultChecked}
        className="checkbox__root cursor-pointer">
        <RadixCheckbox.Indicator className="checkbox__indicator">
          ✓
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <label htmlFor={id} className="cursor-pointer">
        {children}
      </label>
    </div>
  );
}
