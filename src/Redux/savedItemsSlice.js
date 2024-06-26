import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    savedItems: [],
}

export const savedItemsSlice = createSlice({
    name: 'savedItems',
    initialState,
    reducers: {
        setSavedItems: (state, action) => {
            state.savedItems = action.payload;
        },

        setClearSavedItems: () => initialState
    }
})

export const { setSavedItems, setClearSavedItems } = savedItemsSlice.actions;