import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    msgBoxVisibility: false,
}

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMsgBoxVisibility: (state, action) => {
            state.msgBoxVisibility = action.payload;
        },
    }
})

export const { setMsgBoxVisibility } = messageSlice.actions;