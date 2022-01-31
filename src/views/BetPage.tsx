import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addBet } from "../features/bet/betSlice";

const BetPage: React.FC = () => {
  const betList = useAppSelector(state => state.bet.betList)
  const dispatch = useAppDispatch()

  const [text, setText] = useState<string>("");

  return (
    <div>
      <h1>Main List</h1>
      <ul>
        {betList.map(bet => (
          <li>{bet}</li>
        ))}
      </ul>
      <div>
        <input placeholder="Add new bet..." type="text" value={text} onChange={e => setText(e.target.value)} />
        <button onClick={() => dispatch(addBet(text))}>Add</button>
      </div>
    </div>

  )

};

export default BetPage;