import { type ForwardedRef, forwardRef } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  name: string;
  label?: string;
}
export const FormField = forwardRef(
  (
    { className, id, name, label, ...props }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    return (
      <div className="form-field flex flex-col">
        {label && (
          <label className="pb-1" htmlFor={id ?? name}>
            {label}
          </label>
        )}
        <input
          id={id ?? name}
          name={name}
          ref={ref}
          className={`ip ${className}`}
          {...props}
        />
      </div>
    );
  },
);

FormField.displayName = "FormField";

export default FormField;
