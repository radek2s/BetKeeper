import { Icon } from "@app/ui/icon";
import type { BetIdeaType } from "../../model/betIdeaSchema";
import BetIdeaCard from "./BetIdeaCard";

interface Props {
  betIdeas: BetIdeaType[];
}
function BetIdeaList({ betIdeas }: Props) {
  return (
    <section>
      <header className="mb-1 flex gap-2 items-center">
        <Icon name="note" />
        <h3 className="font-bold">Bet Idea list</h3>
      </header>
      <div className="flex flex-col gap-2">
        {betIdeas.length === 0 && <BetIdeaListEmpty />}
        {betIdeas.map((item) => (
          <BetIdeaCard key={item.id} idea={item} />
        ))}
      </div>
    </section>
  );
}

function BetIdeaListEmpty() {
  return <div className="text-center">List is empty. Add your first idea!</div>;
}

export default BetIdeaList;
