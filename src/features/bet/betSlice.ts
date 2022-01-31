import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface BetState {
    //It would be nice to have 
    // a BetEntry class defined
    betList: string[];
}

const initialState: BetState = {
    betList: ["First bet", "Dummy bet"],
}

export const betSlice = createSlice({
    name: 'bet',
    initialState,
    reducers: {
        addBet: (state, action:PayloadAction<string>) => {
            state.betList.push(action.payload);
        },
        clearBets: (state) => {
            state.betList = [];
        }
    }
})

export const { addBet, clearBets } = betSlice.actions;
export default betSlice.reducer;