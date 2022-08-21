import React, { useEffect } from "react";
import BetCreator from "../components/BetCreator";
import BetElement from "../components/BetElement";
import BetApi from "../features/BetApi";

interface IBetPage {
  serviceApi: BetApi;
}
const BetPage: React.FC<IBetPage> = (props: IBetPage) => {

  let [bets, setBets] = React.useState<any>(); //zmienna do wszystkich betów

  useEffect(() => {
    setBets(props.serviceApi.getAllBets());
  }, []);

    return (
      <div>
        <h1>All Bets</h1>
        <ul>
          {bets.map(bet, i) => {
            <BetElement bet={bet} key={i} />
          }}
        </ul>
        {
          /*<textarea placeholder="Enter a bet title" id="bet-title" onChange={e => this.setState({ title: e.target.value })}></textarea>
        <textarea placeholder="Enter Radek's demand" id="bet-option" onChange={e => this.setState({ firstOption: e.target.value })}></textarea>
        <textarea placeholder="Enter Gosia's demand" id="bet-option" onChange={e => this.setState({ secondOption: e.target.value })}></textarea>
        <button onClick={e => this.addBetToLocalStorage(this.state.title, this.state.firstOption,  this.state.secondOption)}>Add a bet</button> */}
        <BetCreator></BetCreator>
      </div>
    )
  


  // renderAllBets() {
  //   let betList = this.getBetListFromLocalStorage();
  //   let result: JSX.Element[] = [];
  //   console.log(betList);

  //   if (betList.length > 0){
  //     betList.forEach(i => {
  //       result.push(<BetComponent bet={i}></BetComponent>);
  //     })
  //   }

  //   return result;
  // }

  // getBetListFromLocalStorage(): BetI[] {
  //   return JSON.parse(window.localStorage.getItem("bet-list") || "[]");
  // }

  // addBetToLocalStorage(title: string, firstOption: string, secondOption: string) {
  //   let betList: any[] = this.getBetListFromLocalStorage();

  //   let bet:BetI= {
  //     id: this.autoIncrementBetId(),
  //     title, //on to ogarnia :D
  //     firstOption,
  //     secondOption,
  //     betState: 0
  //   }

  //   betList.push(bet);

  //   let result: string = JSON.stringify(betList);
  //   window.localStorage.setItem("bet-list", result);
  // }

  // autoIncrementBetId() {
  //   let newId = this.getBetListFromLocalStorage().length + 1;
  //   return newId;
  // }
}

export default BetPage;
