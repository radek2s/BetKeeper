import clsx from "clsx";
import { type ForwardedRef, forwardRef } from "react";
import { Icon } from "../icon";
import type { IconType } from "../icon/types";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: IconType;
};
export const Input = forwardRef(
  (
    { className, icon, ...props }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <div className={clsx(["ip flex gap-1 items-center", className])}>
        {icon && <Icon name={icon} />}
        <input ref={ref} className={`grow ip-text`} {...props} />
      </div>
    );
  },
);

Input.displayName = "Input";
