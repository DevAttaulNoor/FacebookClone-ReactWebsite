import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    selectedPost: 'id',
}

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload;
        },

        setClearPost: () => initialState
    }
})

export const { setSelectedPost, setClearPost } = postSlice.actions;