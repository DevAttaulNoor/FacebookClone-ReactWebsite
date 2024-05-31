import { useEffect } from 'react'
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
        const fetchFriendData = async (friend) => {
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
        };

        const fetchFriendsData = async (friendsList) => {
            const friendDetailsPromises = friendsList.map(friend => fetchFriendData(friend));
            const updatedFriends = await Promise.all(friendDetailsPromises);
            dispatch(setFriendsData(updatedFriends));
        };

        if (friends.length > 0) {
            if (friends.length === 1) {
                fetchFriendData(friends[0]).then((updatedFriend) => {
                    dispatch(setFriendsData([updatedFriend]));
                });
            } else {
                fetchFriendsData(friends);
            }
        }
    }, [friends, dispatch]);

    // Fetch selected friend data when selected friend changes
    useEffect(() => {
        const fetchSelectedFriendData = async (friendfirendsUid) => {
            try {
                if (friendfirendsUid) {
                    const friendDoc = await db.collection('Users').doc(friendfirendsUid).get();

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

    // Fetch friend friends data when friends array changes
    useEffect(() => {
        const fetchFriendFriendsData = async (friendfirendsUid) => {
            const friendDetailsPromises = friendfirendsUid.map(async (friend) => {
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
            dispatch(setFriendFriendsData(updatedFriends));
        };

        if (friendFriends.length > 0) {
            fetchFriendFriendsData(friendFriends);
        }
    }, [friendFriends, dispatch]);

    return (
        null
    )
}

export default Friends;