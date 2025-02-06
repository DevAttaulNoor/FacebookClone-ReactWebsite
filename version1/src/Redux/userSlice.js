import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: '',
    users: [],
    isLoading: true,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload;
        },

        logoutUser: (state) => {
            state.user = null;
        },

        setUsers: (state, action) => {
            state.users = action.payload;
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    }
})

export const { loginUser, logoutUser, setUsers, setLoading } = userSlice.actions;