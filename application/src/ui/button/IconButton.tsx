import { Icon } from "../icon";
import type { IconType } from "../icon/types";

type IconButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  icon: IconType;
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export function IconButton({
  icon,
  variant,
  className,
  isLoading,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`btn-icon ${variant} ${className}`}
      type="button"
      aria-label={icon}
      disabled={isLoading || props.disabled}
      {...props}>
      {isLoading ? <div className="loader-icon" /> : <Icon name={icon} />}
    </button>
  );
}
