import { Icon } from "../icon";
import type { IconType } from "../icon/types";

type IconButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  icon: IconType;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export function IconButton({
  icon,
  variant,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`btn-icon ${variant} ${className}`}
      type="button"
      {...props}>
      <Icon name={icon} />
    </button>
  );
}
