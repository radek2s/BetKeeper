import { configureStore } from "@reduxjs/toolkit";
import betSlice from "./features/bet/betSlice";

export const store = configureStore({
    reducer: {
        bet: betSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch