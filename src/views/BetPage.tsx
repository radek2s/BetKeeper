import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import BetElement from "../components/BetElement";
import BetCreator from "../components/BetCreator";
import { loadBets, saveBets } from "../features/bet/betSlice";

const BetPage: React.FC = () => {
  const betList = useAppSelector(state => state.bet.betList)
  let dispatch = useAppDispatch();

  return (
    <div>
      <h1>Main List</h1>

      <ul>
        {betList.map((bet, i) => (
          <BetElement bet={bet} key={i} />
        ))}
      </ul>

      <div>
        <BetCreator />
      </div>

      <div>
        <button onClick={() => dispatch(saveBets())}>
          Save
        </button>

        {/*TODO: Add React onMountedLifecycleHook to load all Bets from memory*/}
        <button onClick={() => dispatch(loadBets())}>
          Load
        </button>
      </div>


    </div>

  )

};

export default BetPage;