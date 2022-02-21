import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import BetEntry from "../../models/BetEntry";

interface BetState {
    //It would be nice to have 
    // a BetEntry class defined
    betList: BetEntry[];
}

const initialState: BetState = {
    betList: [
        new BetEntry("Are we meet someone in the Cinema?", "Girlfriend wears pink blouse", "Boyfriend goes to the hairdresser"),
    ]

}

export const betSlice = createSlice({
    name: 'bet',
    initialState,
    reducers: {
        addBet: (state, action:PayloadAction<BetEntry>) => {
            state.betList.push(action.payload);
        },
        clearBets: (state) => {
            state.betList = [];
        },
        saveBets: (state) => {
            window.localStorage.setItem("bets", JSON.stringify(state.betList));
        },
        loadBets: (state) => {
            state.betList = [];
            let x = JSON.parse(window.localStorage.getItem("bets") || "[]") as BetEntry[];
            x.forEach(b => state.betList.push(Object.assign(new BetEntry(b.title, b.betOption1, b.betOption2), b)));
        }
    }
})

export const { addBet, clearBets, saveBets, loadBets } = betSlice.actions;
export default betSlice.reducer;