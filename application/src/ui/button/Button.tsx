import type { ReactNode } from "react";

type ButtonProps = {
  variant?: "primary" | "error" | "warn" | "secondary" | "ghost";
  className?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export function Button({
  children,
  className,
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn flex gap-1 items-center justify-center ${variant} ${className}`}
      {...props}>
      {children}
    </button>
  );
}
