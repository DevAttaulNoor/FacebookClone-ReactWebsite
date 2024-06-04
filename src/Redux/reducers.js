import { combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import { userSlice } from "./userSlice";
import { postSlice } from "./postSlice";
import { reelSlice } from "./reelSlice";
import { friendSlice } from "./friendSlice";
import { messageSlice } from "./messageSlice";
import { notificationSlice } from "./notificationSlice";
import { searchSlice } from "./searchSlice";

export const rootReducer = combineReducers({
    authForm: authSlice.reducer,
    user: userSlice.reducer,
    post: postSlice.reducer,
    reel: reelSlice.reducer,
    search: searchSlice.reducer,
    friends: friendSlice.reducer,
    message: messageSlice.reducer,
    notification: notificationSlice.reducer,
})