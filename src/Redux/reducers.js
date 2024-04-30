import { combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { postSlice } from "./postSlice";
import { friendSlice } from "./friendSlice";
import { authSlice } from "./authSlice";
import { notificationSlice } from "./notificationSlice";

export const rootReducer = combineReducers({
    authForm: authSlice.reducer,
    user: userSlice.reducer,
    post: postSlice.reducer,
    friends: friendSlice.reducer,
    notification: notificationSlice.reducer,
})