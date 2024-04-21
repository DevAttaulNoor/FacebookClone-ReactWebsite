import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authForm: 'login',
}

export const authSlice = createSlice({
    name: 'authForm',
    initialState,
    reducers: {
        setAuthForm: (state, action) => {
            state.authForm = action.payload;
        },
    }
})

export const { setAuthForm } = authSlice.actions;