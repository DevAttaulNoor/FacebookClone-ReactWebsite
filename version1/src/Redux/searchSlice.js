import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchBoxVisible: false,
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchBoxVisible: (state, action) => {
            state.searchBoxVisible = action.payload;
        },
    }
})

export const { setSearchBoxVisible } = searchSlice.actions;