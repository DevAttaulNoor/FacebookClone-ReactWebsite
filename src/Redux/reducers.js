import { combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { friendSlice } from "./friendSlice";

export const rootReducer = combineReducers({
    user: userSlice.reducer,
    friends: friendSlice.reducer,
})