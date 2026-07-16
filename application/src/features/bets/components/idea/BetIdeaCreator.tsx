import { Button } from "@app/ui/button/Button";
import { useState } from "react";
import { useCreateBetIdea } from "../../api/betIdea.query";
import BetIdeaEditor from "./BetIdeaEditor";

function BetIdeaCreator() {
  const [state, setState] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const { mutateAsync } = useCreateBetIdea();

  const handleCreate = async (content: string) => {
    try {
      await mutateAsync({ content });
      setState((v) => v + 1);
      setVisible(false);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <section>
      <header className="flex justify-between items-center">
        <h3 className="font-bold">Save your bet idea</h3>
        {!visible && <Button onClick={() => setVisible(true)}>Add idea</Button>}
      </header>
      {visible && (
        <BetIdeaEditor
          key={state}
          onClose={() => {
            setVisible(false);
          }}
          onSave={handleCreate}
        />
      )}
    </section>
  );
}

export default BetIdeaCreator;
