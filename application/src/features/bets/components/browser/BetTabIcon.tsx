import { Icon } from "@app/ui/icon";
import type { IconType } from "@app/ui/icon/types";
import clsx from "clsx";

interface Props {
  icon: IconType;
  name: string;
  isActive?: boolean;
}
export function BetTabIcon({ icon, name, isActive }: Props) {
  return (
    <button
      type="button"
      className={clsx("bet-tab flex flex-col items-center", {
        active: isActive,
      })}>
      <Icon className="bet-tab--icon h-[30px] w-[30px]" name={icon} />
      <span className="text-sm">{name}</span>
    </button>
  );
}
