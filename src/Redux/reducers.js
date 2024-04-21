import { combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { friendSlice } from "./friendSlice";
import { authSlice } from "./authSlice";

export const rootReducer = combineReducers({
    user: userSlice.reducer,
    friends: friendSlice.reducer,
    authForm: authSlice.reducer,
})