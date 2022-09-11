import React, { useEffect } from "react";
import BetElement from "../components/BetElement";
import BetApi from "../features/BetApi";
import BetEntry from "../models/BetEntry";
interface IBetPage {
  serviceApi: BetApi;
}

const BetPage: React.FC<IBetPage> = (props) => {

  const [bets, setBets] = React.useState<BetEntry[]>([]); //zmienna do wszystkich betów
  
  const [request, setRequest] = React.useState<BetEntry>(new BetEntry(-1, "", "", "", "" ));

  useEffect(() => {
    props.serviceApi.getAllBets().then(res => setBets(res)) //wyciągnięcie wartości z koniecznego Promisea
  }, []);

    const saveBet = () => {
      props.serviceApi.addNewBet(request).then(bet => setBets([...bets, bet]));
    }
    const deleteBet = async(bet: BetEntry) => {
      await props.serviceApi.deleteBetById(bet.id);
      props.serviceApi.getAllBets().then(r => setBets(r));
    }
    const updateBet = async(bet: BetEntry) => {
      await props.serviceApi.updateBetById(bet);
    }
  
    return (
      <div>
        <h1>All Bets</h1>
         <ul>
          { bets.map((bet: BetEntry, i: number) => {
            return <BetElement bet={bet} key = {i}
            betDelete = { () => deleteBet(bet)}
            betUpdate = {updateBet}
            />
          })}
        </ul>
        
        <div className="form flex space-between">
          <textarea placeholder="Enter a bet title" id="bet-title" onChange={e => setRequest({...request, title: e.target.value})}></textarea>
          <textarea placeholder="Enter a bet description" id="bet-title" onChange={e => setRequest({...request, description: e.target.value})}></textarea>
          <textarea placeholder="Enter Radek's demand" id="bet-option" onChange={e => setRequest({...request, option1: e.target.value})}></textarea>
          <textarea placeholder="Enter Gosia's demand" id="bet-option" onChange={e => setRequest({...request, option2: e.target.value})}></textarea>
          <button onClick={saveBet}>Add a bet</button>
        </div>
      </div>
    )
}

export default BetPage;
