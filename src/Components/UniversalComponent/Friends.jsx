import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { setFriendFriends, setFriendFriendsData, setFriends, setFriendsData, setSelectedFriendData } from '../../Redux/friendSlice';

function Friends() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const friends = useSelector((state) => state.data.friends.friends);
    const selectedFriend = useSelector((state) => state.data.friends.selectedFriend);
    const friendFriends = useSelector((state) => state.data.friends.friendFriends);

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

            dispatch(setFriends(userFriends));
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const fetchFriendsData = async (friendUid) => {
        const friendDetailsPromises = friendUid.map(async (friend) => {
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
        dispatch(setFriendsData(updatedFriends));
    };

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

    const fetchFriendFriends = async (friendUids) => {
        const friendFriends = friendUids.map(async (friend) => {
            try {
                const friendsCollection = db.collection('Users').doc(friend).collection('Friends');
                const querySnapshot = await friendsCollection.get();
                const userFriends = [];

                querySnapshot.forEach((doc) => {
                    const friendData = doc.data();
                    userFriends.push({
                        friendUid: friendData.friendUid,
                    });
                });

                dispatch(setFriendFriends(userFriends));
            } catch (error) {
                console.error('Error fetching friends:', error);
            }

            const updatedFriends = await Promise.all(friendFriends);
            dispatch(setFriendFriends(updatedFriends));
        })
    };

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

    // Fetch friends when user.uid changes
    useEffect(() => {
        fetchFriends(user.uid);
    }, [user.uid]);

    // Fetch friend data when friends array changes
    useEffect(() => {
        if (friends.length > 0) {
            fetchFriendsData(friends);
        }
    }, [friends]);

    // Fetch selected friend data when selected friend changes
    useEffect(() => {
        fetchSelectedFriendData(selectedFriend);
    }, [selectedFriend]);

    // Fetch friend friends when friends changes
    useEffect(() => {
        // Extract friendUid for each friend
        const friendFriendsUid = friends.map((friend) => friend.friendUid);
        fetchFriendFriends(friendFriendsUid);
    }, [friends]);

    // Fetch friend friends data when friends array changes
    useEffect(() => {
        if (friendFriends.length > 0) {
            fetchFriendFriendsData(friendFriends);
        }
    }, [friendFriends]);

    return (
        null
    )
}

export default Friends;
