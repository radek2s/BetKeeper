import { type ForwardedRef, forwardRef } from "react";

export const TextArea = forwardRef(
  (
    { className, ...props }: React.InputHTMLAttributes<HTMLTextAreaElement>,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    return <textarea ref={ref} className={`ta ${className}`} {...props} />;
  },
);

TextArea.displayName = "TextArea";
