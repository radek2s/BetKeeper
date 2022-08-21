import { title } from "process";
import React, { useEffect } from "react";
import BetElement from "../components/BetElement";
import BetApi from "../features/BetApi";
import BetEntry from "../models/BetEntry";

interface IBetPage {
  serviceApi: BetApi;
}
const BetPage: React.FC<IBetPage> = (props: IBetPage) => {

  const [bets, setBets] = React.useState<any>([]); //zmienna do wszystkich betów
  const request: any = {};

  useEffect(() => {
    props.serviceApi.getAllBets().then(res => setBets(res)) //wyciągnięcie wartości z koniecznego Promisea
  }, []);
  
    return (
      <div>
        <h1>All Bets</h1>
         <ul>
          { bets.map((bet: BetEntry, i: number) => {
            return <BetElement bet={bet} key = {i}
            betDelete = {() => props.serviceApi.deleteBetById(bet.id)}
            betUpdate = {() => props.serviceApi.updateBetById(bet.id, "")}/>
          })}
        </ul>
        
        <textarea placeholder="Enter a bet title" id="bet-title" onChange={e => request["title"] = e.target.value}></textarea>
        <textarea placeholder="Enter a bet description" id="bet-title" onChange={e => request["description"] = e.target.value}></textarea>
        <textarea placeholder="Enter Radek's demand" id="bet-option" onChange={e => request["option1"] = e.target.value}></textarea>
        <textarea placeholder="Enter Gosia's demand" id="bet-option" onChange={e => request["option2"] = e.target.value}></textarea>

        { request["isFinished"] = false}
        { request["winner"] = false}
        <button onClick={e => props.serviceApi.addNewBet(request)}>Add a bet</button>
        {/* {<BetCreator></BetCreator>} */}
      </div>
    )
}

export default BetPage;
