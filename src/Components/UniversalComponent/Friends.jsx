import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { setUsers } from '../../Redux/userSlice';
import { setFriendFriends, setFriendFriendsData, setFriends, setFriendsData, setSelectedFriendData } from '../../Redux/friendSlice';

function Friends() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const friends = useSelector((state) => state.data.friends.friends);
    const friendFriends = useSelector((state) => state.data.friends.friendFriends);
    const selectedFriend = useSelector((state) => state.data.friends.selectedFriend);

    // Fetching all the users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await db.collection("Users").get();
                const usersData = querySnapshot.docs.map(doc => doc.data());
                dispatch(setUsers(usersData));
            } catch (error) {
                console.error('Error getting documents:', error);
            }
        };

        fetchUsers();
    }, [user.uid, dispatch]);

    // Fetch friends when user.uid changes and friendFriends when selectedUser changes
    useEffect(() => {
        const fetchFriends = async (uid) => {
            try {
                const friendsCollection = db.collection('Users').doc(uid).collection('Friends');
                const querySnapshot = await friendsCollection.get();
                const userFriends = [];

                querySnapshot.forEach((doc) => {
                    const friendData = doc.data();
                    userFriends.push({
                        friendUid: friendData.friendUid,
                    });
                });

                if (uid === user.uid) {
                    dispatch(setFriends(userFriends));
                } else {
                    dispatch(setFriendFriends(userFriends));
                }
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends(user.uid);
        if (selectedFriend) {
            fetchFriends(selectedFriend)
        }
    }, [user.uid, selectedFriend, dispatch]);

    // Fetch friend data when friends array changes
    useEffect(() => {
        const fetchFriendsData = async (friendsArray) => {
            if (!Array.isArray(friendsArray)) return;

            const friendDetailsPromises = friendsArray.map(async (friend) => {
                try {
                    const friendDoc = await db.collection('Users').doc(friend.friendUid).get();

                    if (friendDoc.exists) {
                        const friendDetails = friendDoc.data();
                        return {
                            ...friend,
                            username: friendDetails.username || '',
                            photoURL: friendDetails.photoURL || '',
                        };
                    }
                } catch (error) {
                    console.error('Error fetching friend details:', error);
                }
                return null;
            });

            const updatedFriends = await Promise.all(friendDetailsPromises);
            dispatch(setFriendsData(updatedFriends.filter(friend => friend !== null)));
        };

        if (friends.length > 0) {
            fetchFriendsData(friends);
        }
    }, [friends, dispatch]);

    // Fetch selected friend data when selected friend changes
    useEffect(() => {
        const fetchSelectedFriendData = async (friendUid) => {
            try {
                if (friendUid) {
                    const friendDoc = await db.collection('Users').doc(friendUid).get();

                    if (friendDoc.exists) {
                        const friendDetails = friendDoc.data();
                        dispatch(setSelectedFriendData(friendDetails));
                    }
                }
            } catch (error) {
                console.error('Error fetching friend details:', error);
            }
        };

        fetchSelectedFriendData(selectedFriend);
    }, [selectedFriend, dispatch]);

    // Fetch friend friends data when friendFriends array changes
    useEffect(() => {
        const fetchFriendFriendsData = async (friendFriendsArray) => {
            if (!Array.isArray(friendFriendsArray)) return;

            const friendDetailsPromises = friendFriendsArray.map(async (friend) => {
                try {
                    const friendDoc = await db.collection('Users').doc(friend.friendUid).get();

                    if (friendDoc.exists) {
                        const friendDetails = friendDoc.data();
                        return {
                            ...friend,
                            username: friendDetails.username || '',
                            photoURL: friendDetails.photoURL || '',
                            coverphotoUrl: friendDetails.coverphotoUrl || '',
                        };
                    }
                } catch (error) {
                    console.error('Error fetching friend details:', error);
                }
                return null;
            });

            const updatedFriends = await Promise.all(friendDetailsPromises);
            dispatch(setFriendFriendsData(updatedFriends.filter(friend => friend !== null)));
        };

        if (friendFriends.length > 0) {
            fetchFriendFriendsData(friendFriends);
        }
    }, [friendFriends, dispatch]);

    return (
        null
    );
}

export default Friends;