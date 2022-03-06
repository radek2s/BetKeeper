import { useState } from "react";
import { addBet, saveBets } from "../features/bet/betSlice";
import { useAppDispatch } from "../hooks"
import BetEntry from "../models/BetEntry";

const BetCreator: React.FC = () => {
    const dispatch = useAppDispatch();

    const [betTitle, setBetTitle] = useState<string>("");
    const [betOption1, setBetOption1] = useState<string>("");
    const [betOption2, setBetOption2] = useState<string>("");

    let createBet = ():void => {
        if(!!betTitle && !!betOption1 && !!betOption2) {
            dispatch(addBet(new BetEntry(betTitle, betOption1, betOption2)));
            dispatch(saveBets());
            clearInputs();
        } else {
            console.error("Invalid bet!");
        }
    };

    let clearInputs = ():void => {
        setBetTitle("");
        setBetOption1("");
        setBetOption2("");
    };


    return (
        <div>
            <input placeholder="Bet title" value={betTitle} onChange={e => setBetTitle(e.target.value)}/>
            <input placeholder="Bet Option 1" value={betOption1} onChange={e => setBetOption1(e.target.value)}/>
            <input placeholder="Bet Option 2" value={betOption2} onChange={e => setBetOption2(e.target.value)}/>
            <button onClick={() => createBet()}>Add</button>
        </div>
    )
}

export default BetCreator;