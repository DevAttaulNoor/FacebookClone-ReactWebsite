import { combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./authSlice";
import { userSlice } from "./userSlice";
import { postSlice } from "./postSlice";
import { reelSlice } from "./reelSlice";
import { friendSlice } from "./friendSlice";
import { searchSlice } from "./searchSlice";
import { messageSlice } from "./messageSlice";
import { savedItemsSlice } from "./savedItemsSlice";
import { notificationSlice } from "./notificationSlice";

export const rootReducer = combineReducers({
    authForm: authSlice.reducer,
    user: userSlice.reducer,
    post: postSlice.reducer,
    reel: reelSlice.reducer,
    search: searchSlice.reducer,
    friends: friendSlice.reducer,
    message: messageSlice.reducer,
    savedItems: savedItemsSlice.reducer,
    notification: notificationSlice.reducer,
})