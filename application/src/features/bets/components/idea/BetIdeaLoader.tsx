import type { ReactNode } from "react";
import { useBetIdeas } from "../../api/betIdea.query";
import type { BetIdeaType } from "../../model/betIdeaSchema";

interface Props {
  children: (betIdeas: BetIdeaType[]) => ReactNode;
}
function BetIdeaLoader({ children }: Props) {
  const { data, isLoading, error } = useBetIdeas();
  if (isLoading) return <div>Loading bet ideas...</div>;

  if (error) return <div>Failed to load your bet ideas.</div>;

  if (!data) return <div>No bet ideas.</div>;

  return children(data);
}
export default BetIdeaLoader;
