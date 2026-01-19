import { Input } from "@app/ui/input/Input";
import type { ChangeEvent } from "react";
import { useBetSearchFilter } from "../BetSearchFilterProvider";

function SearchCreateFilter() {
  const { createdAfter, setCreatedAfter, createdBefore, setCreatedBefore } =
    useBetSearchFilter();

  const hanldeSet = (
    v: ChangeEvent<HTMLInputElement>,
    method: (v: string | null) => void,
  ) => {
    const value = v.target.value;
    if (!value) {
      method(null);
    } else {
      method(value);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm">Creation date:</span>
      <div className="flex gap-2 items-center">
        <Input
          className="grow"
          type="date"
          value={createdAfter || undefined}
          max={createdBefore || undefined}
          onChange={(v) => hanldeSet(v, setCreatedAfter)}
          placeholder="from"
        />{" "}
        -{" "}
        <Input
          className="grow"
          type="date"
          placeholder="to"
          value={createdBefore || undefined}
          min={createdAfter || undefined}
          onChange={(v) => hanldeSet(v, setCreatedBefore)}
        />
      </div>
    </div>
  );
}

export default SearchCreateFilter;
