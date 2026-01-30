import { Button } from "@app/ui/button/Button";
import { Icon } from "@app/ui/icon";
import { DropdownMenu } from "radix-ui";
import type { SortByType, SortOrderType, SortType } from "./types";

interface Props {
  state: SortType;
  onChange: (state: SortType) => void;
}
function BetSortBtn({ state, onChange }: Props) {
  const { sortBy, order } = state;

  const getBtnLabel = () => {
    switch (sortBy) {
      case "CREATED":
        return "Created date";
      case "UPDATED":
        return "Updated date";
      default:
        return "Sort by";
    }
  };

  const getOrderIcon = () => {
    switch (order) {
      case "ASC":
        return "sort-down";
      case "DSC":
        return "sort-up";
      default:
        return "sort";
    }
  };

  const update = (sortBy: SortByType, order: SortOrderType) => {
    onChange({ sortBy, order });
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button className="chip">
          {getBtnLabel()}
          <Icon name={getOrderIcon()} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="dropdown--content panel"
          sideOffset={5}
          side="bottom">
          <DropdownMenu.Label className="dropdown--label">
            by created date
          </DropdownMenu.Label>
          <DropdownMenu.Item
            className="dropdown--item"
            onClick={() => update("CREATED", "ASC")}>
            <Icon name="sort-down" />
            From lastest to oldest
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="dropdown--item"
            onClick={() => update("CREATED", "DSC")}>
            <Icon name="sort-up" />
            From oldest to latest
          </DropdownMenu.Item>
          <DropdownMenu.Label className="dropdown--label">
            by updated date
          </DropdownMenu.Label>
          <DropdownMenu.Item
            className="dropdown--item"
            onClick={() => update("UPDATED", "ASC")}>
            <Icon name="sort-down" />
            From lastest to oldest
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="dropdown--item"
            onClick={() => update("UPDATED", "DSC")}>
            <Icon name="sort-up" />
            From oldest to latest
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
export default BetSortBtn;
