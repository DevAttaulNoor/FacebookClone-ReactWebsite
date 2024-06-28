import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    savedItemsId: [],
    savedItemsData: [],
}

export const savedItemsSlice = createSlice({
    name: 'savedItems',
    initialState,
    reducers: {
        setSavedItemsId: (state, action) => {
            state.savedItemsId = action.payload;
        },

        setSavedItemsData: (state, action) => {
            state.savedItemsData = action.payload;
        },

        setClearSavedItems: () => initialState
    }
})

export const { setSavedItemsId, setSavedItemsData, setClearSavedItems } = savedItemsSlice.actions;