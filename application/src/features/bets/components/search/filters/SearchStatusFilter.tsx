import { Button } from "@app/ui/button/Button";
import type { BetStatus } from "@domain/bet";
import { useBetSearchFilter } from "../BetSearchFilterProvider";

function SearchStatusFilter() {
  const { status, setStatus } = useBetSearchFilter();

  const getVariant = (value: BetStatus) => {
    if (status?.includes(value)) return "primary";
    return undefined;
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm">Status:</span>
      <div className="flex gap-1">
        <Button
          className="grow"
          variant={getVariant("pending")}
          onClick={() => setStatus("pending")}>
          Pending
        </Button>
        <Button
          className="grow"
          variant={getVariant("resolved")}
          onClick={() => setStatus("resolved")}>
          Resolved
        </Button>
        <Button
          className="grow"
          variant={getVariant("completed")}
          onClick={() => setStatus("completed")}>
          Completed
        </Button>
      </div>
    </div>
  );
}

export default SearchStatusFilter;
