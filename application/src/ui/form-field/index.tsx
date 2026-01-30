import clsx from "clsx";
import { type ForwardedRef, forwardRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  name: string;
  label?: string;
  required?: boolean;
}
export const FormField = forwardRef(
  (
    { className, id, name, label, required, ...props }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <div className="form-field flex flex-col">
        {label && (
          <label className="pb-1 text-sm" htmlFor={id ?? name}>
            {label}
            {required ? <span className="text-error">*</span> : ""}
          </label>
        )}
        <div className={clsx(["ip", className])}>
          <input
            id={id ?? name}
            name={name}
            ref={ref}
            className={"w-full"}
            {...props}
          />
        </div>
      </div>
    );
  },
);

FormField.displayName = "FormField";

export default FormField;
