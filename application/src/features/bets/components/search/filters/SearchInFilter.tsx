import { Button } from "@app/ui/button/Button";
import {
  type SearchInType,
  useBetSearchFilter,
} from "../BetSearchFilterProvider";

function SearchInFilter() {
  const { searchIn, setSearchIn } = useBetSearchFilter();

  const handleSetSearch = (value: SearchInType) => {
    if (searchIn === value) {
      setSearchIn(null);
      return;
    }
    setSearchIn(value);
  };

  const getVariant = (value: SearchInType) => {
    if (searchIn === value) return "primary";
    return undefined;
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm">Search in:</span>
      <div className="flex gap-1">
        <Button
          className="grow"
          variant={getVariant("CREATOR")}
          onClick={() => handleSetSearch("CREATOR")}>
          Created by you
        </Button>
        <Button
          className="grow"
          variant={getVariant("INVITED")}
          onClick={() => handleSetSearch("INVITED")}>
          You are invited
        </Button>
      </div>
    </div>
  );
}

export default SearchInFilter;
