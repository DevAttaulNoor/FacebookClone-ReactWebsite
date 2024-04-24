import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedPost: '',
}

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload;
        },
    }
})

export const { setSelectedPost } = postSlice.actions;