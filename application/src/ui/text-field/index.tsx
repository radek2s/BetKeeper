import { type ForwardedRef, forwardRef } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string;
  name: string;
  label?: string;
  required?: boolean;
}
export const TextField = forwardRef(
  (
    { className, id, name, label, required, ...props }: Props,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    return (
      <div className="form-field flex flex-col">
        {label && (
          <label className="pb-1 text-sm" htmlFor={id ?? name}>
            {label}
            {required ? <span className="text-error">*</span> : ""}
          </label>
        )}
        <textarea
          id={id ?? name}
          name={name}
          ref={ref}
          className={`ta ${className}`}
          {...props}
        />
      </div>
    );
  },
);

TextField.displayName = "TextField";

export default TextField;
