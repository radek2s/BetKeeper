import type { ReactNode } from "react";

type ButtonProps = {
  variant?: "primary" | "error" | "warn" | "secondary" | "ghost";
  className?: string;
  children: ReactNode;
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export function Button({
  children,
  className,
  variant,
  isLoading,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn flex gap-1 items-center justify-center ${variant} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}>
      {isLoading ? <div className="btn--loader" /> : children}
    </button>
  );
}
