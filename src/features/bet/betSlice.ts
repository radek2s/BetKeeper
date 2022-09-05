import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import BetEntry from "../../models/BetEntry"
import axios from "axios"
interface BetState {
  //It would be nice to have
  // a BetEntry class defined
  betList: BetEntry[]
}

const initialState: BetState = {
  betList: [
    new BetEntry(
      "Are we meet someone in the Cinema?",
      "Girlfriend wears pink blouse",
      "Boyfriend goes to the hairdresser"
    ),
  ],
}

export const betSlice = createSlice({
  name: "bet",
  initialState,
  reducers: {
    addBet: (state, action: PayloadAction<BetEntry>) => {
      state.betList.push(action.payload)
    },
    clearBets: (state) => {
      state.betList = []
    },
    saveBets: (state) => {
      window.localStorage.setItem("bet-list", JSON.stringify(state.betList))
    },
    loadBets: (state) => {
      state.betList = []
      let x = JSON.parse(window.localStorage.getItem("bet-list") || "[]") as BetEntry[] //TODO: zmiana na zewnętrzną bazę danych
      x.forEach((b) =>
        state.betList.push(
          Object.assign(new BetEntry(b.title, b.betOption1, b.betOption2), b)
        )
      )
    },
    loadBet: (betId) => {
      axios
        .get(`http://localhost:8080/bet?ID=${betId}}`)
        .then(function (response: any) {
          console.log(response)
        })
        .catch((error) => console.log(error))
    },
  },
})

export const { addBet, clearBets, saveBets, loadBets, loadBet } = betSlice.actions
export default betSlice.reducer
