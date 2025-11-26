import { Select as RadixSelect } from "radix-ui";
import { forwardRef } from "react";
import { Icon } from "../icon";
export function Select() {
  return (
    <RadixSelect.Root open={true}>
      <RadixSelect.Trigger className="select__triger">
        <RadixSelect.Value placeholder="Select..." />
        <RadixSelect.Icon>
          <Icon name="arrow-left" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="select__content">
          <RadixSelect.ScrollUpButton>Up</RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className="select__viewport">
            <SelectItem value="comon">Common</SelectItem>
            <SelectItem value="shared">Shared</SelectItem>
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton>Down</RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

const SelectItem = forwardRef<HTMLDivElement, RadixSelect.SelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <RadixSelect.Item className={className} {...props} ref={forwardedRef}>
        <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
        <RadixSelect.ItemIndicator className="SelectItemIndicator">
          Ok
        </RadixSelect.ItemIndicator>
      </RadixSelect.Item>
    );
  },
);
