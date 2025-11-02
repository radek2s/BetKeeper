import type { ReactNode } from "react";

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost";
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
    <button className={`btn ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
