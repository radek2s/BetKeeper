import { IconButton } from "@app/ui/button/IconButton";
import { Input } from "@app/ui/input/Input";
import { useBetSearchFilter } from "../BetSearchFilterProvider";

interface Props {
  isActive: boolean;
  onChange: (isActive: boolean) => void;
}
function SearchTextFilter({ isActive, onChange }: Props) {
  const { searchText, setSearchText } = useBetSearchFilter();
  return (
    <div className="flex gap-1">
      <Input
        onClick={() => onChange(true)}
        className="grow"
        icon="search"
        value={searchText || ""}
        onChange={(v) => setSearchText(v.target.value)}
        placeholder="Search bets..."
      />
      {isActive && <IconButton icon="close" onClick={() => onChange(false)} />}
    </div>
  );
}

export default SearchTextFilter;
