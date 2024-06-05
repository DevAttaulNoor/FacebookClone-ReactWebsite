import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notification: [],
    notiBoxVisible: false,
    chatNotification: [],
    chatNotiBoxVisible: false,
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

        setClearNotification: () => initialState
    }
})

export const { setNotification, setNotiBoxVisible, setChatNotification, setChatNotiBoxVisible, setClearNotification } = notificationSlice.actions;