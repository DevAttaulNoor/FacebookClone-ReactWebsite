import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    friends: '',
    friendsData: null,
    isLoading: true,
}

export const friendSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        setFriends: (state, action) => {
            state.friends = action.payload;
        },

        setFriendsData: (state, action) => {
            state.friendsData = action.payload;
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    }
})

export const { setFriends, setFriendsData, setLoading } = friendSlice.actions;