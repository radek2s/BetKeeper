import clsx from "clsx";
import { Icon } from "../icon";
import type { IconType } from "../icon/types";

type IconButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  icon: IconType;
  isLoading?: boolean;
  badge?: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export function IconButton({
  icon,
  variant,
  className,
  isLoading,
  badge,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={clsx([
        `btn-icon`,
        variant,
        className,
        { "btn-icon--badge-wrapper": (badge ?? 0) > 0 },
      ])}
      type="button"
      aria-label={icon}
      disabled={isLoading || props.disabled}
      {...props}>
      {isLoading ? <div className="loader-icon" /> : <Icon name={icon} />}
      {(badge ?? 0) > 0 && <div className="btn-icon--badge">{badge}</div>}
    </button>
  );
}
