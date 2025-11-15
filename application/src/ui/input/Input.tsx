// type InputProps = {
//   size: "small";

import { type ForwardedRef, forwardRef } from "react";

// } & ;
export const Input = forwardRef(
  (
    { className, ...props }: React.InputHTMLAttributes<HTMLInputElement>,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return <input ref={ref} className={`ip ${className}`} {...props} />;
  },
);

Input.displayName = "Input";
