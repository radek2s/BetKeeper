"use client";
import { Select as RadixSelect } from "radix-ui";
import { forwardRef, type PropsWithChildren, useState } from "react";
import { Icon } from "../icon";

interface SelectProps extends PropsWithChildren {
  id?: string;
  name: string;
  value?: string;
  label?: string;
  placeholder: string;
  onChange: (value: string) => void;
}
export function Select({
  id,
  name,
  placeholder,
  children,
  label,
  value,
  onChange,
}: SelectProps) {
  return (
    <div className="form-field flex flex-col">
      {label && (
        <label className="pb-1 text-sm" htmlFor={id ?? name}>
          {label}
        </label>
      )}

      <RadixSelect.Root onValueChange={onChange} value={value}>
        <RadixSelect.Trigger className="select__triger" id={id ?? name}>
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <Icon name="arrow-dropdown" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className="select__content">
            <RadixSelect.ScrollUpButton>Up</RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport className="select__viewport">
              {children}
            </RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton>Down</RadixSelect.ScrollDownButton>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}

export const SelectItem = forwardRef<
  HTMLDivElement,
  RadixSelect.SelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <RadixSelect.Item
      className={`select__item ${className}`}
      {...props}
      ref={forwardedRef}>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="SelectItemIndicator">
        <Icon name="check" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});
