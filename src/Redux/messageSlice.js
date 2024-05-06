import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    msgFriend: '',
    msgFriendBoxVisibility: false,
    msgAnyone: '',
    msgAnyoneBoxVisibility: false,
}

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMsgFriend: (state, action) => {
            state.msgFriend = action.payload;
        },

        setMsgFriendBoxVisibility: (state, action) => {
            state.msgFriendBoxVisibility = action.payload;
        },
        
        setMsgAnyone: (state, action) => {
            state.msgAnyone = action.payload;
        },

        setMsgAnyoneBoxVisibility: (state, action) => {
            state.msgAnyoneBoxVisibility = action.payload;
        },
    }
})

export const { setMsgFriend, setMsgFriendBoxVisibility, setMsgAnyone, setMsgAnyoneBoxVisibility } = messageSlice.actions;