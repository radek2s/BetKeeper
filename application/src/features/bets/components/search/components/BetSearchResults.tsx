import { BetCard } from "../../BetCard";
import { useBetFilterResults } from "../filters";

export function BetSearchResults() {
  const filterResults = useBetFilterResults();
  return (
    <div className="mt-4">
      <span className="text-xs">Results</span>
      <hr />
      <div className="mt-4">
        {filterResults.map((bet) => (
          <BetCard key={bet.id} bet={bet} />
        ))}
      </div>
    </div>
  );
}
