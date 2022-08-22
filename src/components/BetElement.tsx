import BetEntry from "../models/BetEntry";
import BetApi from "../features/BetApi";
import React from "react";
interface IBetElement{
    bet : BetEntry;
    betDelete : (id: number) => void
    betUpdate : (bet: BetEntry) => void
}

const BetElement:React.FC<IBetElement> = ({bet, betDelete, betUpdate}) => {
    const [request, setRequest] = React.useState<BetEntry>({...bet});
    

    return (
        <div className="wesoły-div-😂">
            <h1><input onChange={e=> setRequest({...request, title: e.target.value})} value={request.title}/></h1>
            <button onClick={e => {betUpdate(request)}}>✅</button>
            <button onClick={e => {betDelete(bet.id)}}>❌</button>
            <div className="options flex">
                <div className={bet.isFinished == true ? 'winner' : ''} onClick={() => {betUpdate({...request, isFinished: true, winner: true})}}>{bet.option1}</div>
                <div className={bet.isFinished == true ? 'winner' : ''} onClick={() => {betUpdate({...request, isFinished: true})}}>{bet.option2}</div>
            </div>
        </div>
    )
};

export default BetElement;