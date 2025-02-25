import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notification: [],
    notiBoxVisible: false,
    chatNotification: [],
    chatNotiBoxVisible: false,
    userBoxVisible: false,
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification: (state, action) => {
            state.notification = action.payload;
        },

        setNotiBoxVisible: (state, action) => {
            state.notiBoxVisible = action.payload;
        },

        setChatNotification: (state, action) => {
            state.chatNotification = action.payload;
        },

        setChatNotiBoxVisible: (state, action) => {
            state.chatNotiBoxVisible = action.payload;
        },

        setUserBoxVisible: (state, action) => {
            state.userBoxVisible = action.payload;
        },

        setClearNotification: () => initialState
    }
})

export const { setNotification, setNotiBoxVisible, setChatNotification, setChatNotiBoxVisible, setUserBoxVisible, setClearNotification } = notificationSlice.actions;