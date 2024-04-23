import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    friends: [],
    friendsData: [],
    friendFriends: '',
    friendFriendsData: [],
    selectedfriendFriend: ''
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
        
        removeFriend: (state, action) => {
            const unfriend = action.payload;
            state.friends = state.friends.filter(friend => friend.friendUid !== unfriend);
            state.friendsData = state.friendsData.filter(friend => friend.friendUid !== unfriend);
        },

        setFriendFriends: (state, action) => {
            state.friendFriends = action.payload;
        },

        setFriendFriendsData: (state, action) => {
            state.friendFriendsData = action.payload;
        },

        setSelectedFriendFriends: (state, action) => {
            state.selectedfriendFriend = action.payload;
        },
    }
})

export const { setFriends, setFriendsData, removeFriend, setFriendFriends, setFriendFriendsData } = friendSlice.actions;