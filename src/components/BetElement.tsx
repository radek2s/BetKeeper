import BetEntry from "../models/BetEntry";
import React from "react";
interface IBetElement{
    bet : BetEntry;
    betDelete : (id: number) => void
    betUpdate : (id: number) => void
}

const BetElement:React.FC<IBetElement> = ({bet, betDelete, betUpdate}) => {
    return (
        <div className="wesoły-div-😂">
            <h1>{bet.title}</h1>
            <button onClick={e => {betDelete(bet.id)}}>X</button>
            <div className="options flex">
                <div className={bet.isFinished == true ? 'winner' : ''} onClick={e => {betUpdate(bet.id)}}>{bet.option1}</div>
                <div className={bet.isFinished == true ? 'winner' : ''} onClick={() => bet.winner = false}>{bet.option2}</div>
            </div>
        </div>
    )
};

export default BetElement;