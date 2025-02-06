import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reels: [],
    selectedReel: '',
}

export const reelSlice = createSlice({
    name: 'reel',
    initialState,
    reducers: {
        setReels: (state, action) => {
            state.reels = action.payload;
        },

        setSelectedReel: (state, action) => {
            state.selectedReel = action.payload;
        },

        setClearReels: () => initialState
    }
})

export const { setReels, setSelectedReel, setClearReels } = reelSlice.actions;