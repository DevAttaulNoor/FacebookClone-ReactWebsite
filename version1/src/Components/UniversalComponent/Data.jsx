import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { setUsers } from '../../Redux/userSlice';
import { setSavedItemsData, setSavedItemsId } from '../../Redux/savedItemsSlice';
import { setFriendFriends, setFriendFriendsData, setFriends, setFriendsData, setSelectedFriendData } from '../../Redux/friendSlice';

function Data() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const savedItemsId = useSelector((state) => state.data.savedItems.savedItemsId);
    const friendFriends = useSelector((state) => state.data.friends.friendFriends);
    const selectedFriend = useSelector((state) => state.data.friends.selectedFriend);

    // Function to fetch friend data
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
    }, [dispatch]);

    // Real-time fetching for savedItems Id
    useEffect(() => {
        const savedItemsRef = db.collection('Users').doc(user.uid).collection('SavedItems');

        const unsubscribe = savedItemsRef.onSnapshot((snapshot) => {
            const itemId = snapshot.docs.map(doc => doc.data());
            dispatch(setSavedItemsId(itemId));
        });

        return () => {
            unsubscribe();
        };
    }, [user.uid, dispatch]);

    // Real-time fetching for savedItems Data from savedItems Id
    useEffect(() => {
        const fetchPostAttributes = async (postId) => {
            try {
                const postDoc = await db.collection('Posts').doc(postId).get();
                if (postDoc.exists) {
                    return postDoc.data();
                } else {
                    console.log('Post not found.');
                    return null;
                }
            } catch (error) {
                console.error('Error fetching post attributes:', error);
                return null;
            }
        };
    
        const fetchReelAttributes = async (reelId) => {
            try {
                const reelDoc = await db.collection('Reels').doc(reelId).get();
                if (reelDoc.exists) {
                    return reelDoc.data();
                } else {
                    console.log('Reel not found.');
                    return null;
                }
            } catch (error) {
                console.error('Error fetching reel attributes:', error);
                return null;
            }
        };
        
        const fetchData = async () => {
            const saveItems = await Promise.all(savedItemsId.map(async (savedItem) => {
                const saveItemsPostData = await fetchPostAttributes(savedItem.postId);
                const saveItemsReelData = await fetchReelAttributes(savedItem.reelId);
                if (saveItemsPostData) {
                    return { id: savedItem.postId, data: saveItemsPostData };
                }
                if (saveItemsReelData) {
                    return { id: savedItem.reelId, data: saveItemsReelData };
                }
                return null;
            }));
            dispatch(setSavedItemsData(saveItems.filter(item => item !== null)))
        };

        fetchData();
    }, [savedItemsId, dispatch]);

    // Real-time listener for selected friend's friends
    useEffect(() => {
        if (!selectedFriend) return;

        const unsubscribe = db.collection('Users').doc(selectedFriend).collection('Friends')
            .onSnapshot((querySnapshot) => {
                const friendFriendsArray = [];
                querySnapshot.forEach((doc) => {
                    const friendData = doc.data();
                    friendFriendsArray.push({
                        friendUid: friendData.friendUid,
                    });
                });
                dispatch(setFriendFriends(friendFriendsArray));
            }, (error) => {
                console.error('Error fetching selected friends friends:', error);
            });

        return () => unsubscribe();
    }, [selectedFriend, dispatch]);

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

    // Real-time listener for friends
    useEffect(() => {
        if (!user.uid) return;

        const unsubscribe = db.collection('Users').doc(user.uid).collection('Friends')
            .onSnapshot((querySnapshot) => {
                const userFriends = [];
                querySnapshot.forEach((doc) => {
                    const friendData = doc.data();
                    userFriends.push({
                        friendUid: friendData.friendUid,
                    });
                });
                dispatch(setFriends(userFriends));

                // Fetch friend data immediately after setting friends
                fetchFriendsData(userFriends); // Add this line
            }, (error) => {
                console.error('Error fetching friends:', error);
            });

        return () => unsubscribe();
    }, [user.uid, dispatch]);

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

    return null;
}

export default Data;
