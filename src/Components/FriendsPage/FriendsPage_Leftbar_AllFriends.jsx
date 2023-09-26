import '../../CSS/FriendsPage/FriendsPage_Leftbar_AllFriends.css'
import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { db } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

async function fetchFriendsData(userUid, setFriends) {
    try {
        const friendsCollection = db.collection('Users').doc(userUid).collection('Friends');
        const querySnapshot = await friendsCollection.get();
        const userFriends = [];

        querySnapshot.forEach((doc) => {
            const friendData = doc.data();
            userFriends.push({
                friendUid: friendData.friendUid,
                // You can fetch other user details here using a similar approach
            });
        });

        setFriends(userFriends);
    } catch (error) {
        console.error('Error fetching friends:', error);
    }
}

async function fetchFriendDetailsData(friends, setFriends) {
    const friendDetailsPromises = friends.map(async (friend) => {
        try {
            const friendDoc = await db.collection('Users').doc(friend.friendUid).get();

            if (friendDoc.exists) {
                const friendDetails = friendDoc.data();
                return {
                    ...friend,
                    username: friendDetails.username || 'No Display Name',
                    photoURL: friendDetails.photoURL || '',
                    // Add more fields as needed
                };
            }
        } catch (error) {
            console.error('Error fetching friend details:', error);
        }
        return null;
    });

    const updatedFriends = await Promise.all(friendDetailsPromises);
    setFriends(updatedFriends.filter((friend) => friend !== null));
}

async function unfriendUser(loggedInUserUid, friendUid) {
    try {
        const userRef = db.collection('Users').doc(loggedInUserUid);
        const friendRef = db.collection('Users').doc(friendUid);

        // Get the list of friends for the logged-in user
        const userFriendsQuery = await userRef.collection('Friends').where('friendUid', '==', friendUid).get();

        // Get the list of friends for the friend
        const friendFriendsQuery = await friendRef.collection('Friends').where('friendUid', '==', loggedInUserUid).get();

        // Check if there is a match in both user's and friend's friends lists
        if (!userFriendsQuery.empty && !friendFriendsQuery.empty) {
            // Remove friend from logged-in user's "Friends" collection
            userFriendsQuery.forEach(async (doc) => {
                await userRef.collection('Friends').doc(doc.id).delete();
            });

            // Remove logged-in user from the friend's "Friends" collection
            friendFriendsQuery.forEach(async (doc) => {
                await friendRef.collection('Friends').doc(doc.id).delete();
            });

            console.log('Successfully unfriended user:', friendUid);
        } else {
            console.log('Friend not found in both user lists.');
        }

        // Now, remove any previous friend requests that have been accepted
        const userFriendRequestQuerySender = await userRef.collection('friendRequests')
            .where('senderUid', '==', friendUid)
            .where('receiverUid', '==', loggedInUserUid)
            .get();

        const userFriendRequestQueryReceiver = await userRef.collection('friendRequests')
            .where('receiverUid', '==', friendUid)
            .where('senderUid', '==', loggedInUserUid)
            .get();

        const friendFriendRequestQuerySender = await friendRef.collection('friendRequests')
            .where('senderUid', '==', loggedInUserUid)
            .where('receiverUid', '==', friendUid)
            .get();

        const friendFriendRequestQueryReceiver = await friendRef.collection('friendRequests')
            .where('receiverUid', '==', loggedInUserUid)
            .where('senderUid', '==', friendUid)
            .get();

        userFriendRequestQuerySender.forEach(async (doc) => {
            await userRef.collection('friendRequests').doc(doc.id).delete();
        });

        userFriendRequestQueryReceiver.forEach(async (doc) => {
            await userRef.collection('friendRequests').doc(doc.id).delete();
        });

        friendFriendRequestQuerySender.forEach(async (doc) => {
            await friendRef.collection('friendRequests').doc(doc.id).delete();
        });

        friendFriendRequestQueryReceiver.forEach(async (doc) => {
            await friendRef.collection('friendRequests').doc(doc.id).delete();
        });

    } catch (error) {
        console.error('Error unfriending user:', error);
    }
}

function FriendsPage_Leftbar_AllFriends() {
    const [{ user }, dispatch] = useStateValue();
    const [friends, setFriends] = useState([]);
    const [dialogVisibility, setDialogVisibility] = useState({});
    const dialogBoxRefs = useRef({});

    useEffect(() => {
        // Fetch friends data when user.uid changes
        fetchFriendsData(user.uid, setFriends);
    }, [user.uid]);

    useEffect(() => {
        // Fetch friend details when friends array changes
        if (friends.length > 0) {
            fetchFriendDetailsData(friends, setFriends);
        }
    }, [friends]);

    const toggleDialog = (friendUid) => {
        setDialogVisibility((prevVisibility) => ({
            ...prevVisibility,
            [friendUid]: !prevVisibility[friendUid],
        }));
    };

    useEffect(() => {
        const handleOutsideClick = (e, friendUid) => {
            if (
                dialogBoxRefs.current[friendUid] &&
                !dialogBoxRefs.current[friendUid].contains(e.target)
            ) {
                setDialogVisibility((prevVisibility) => ({
                    ...prevVisibility,
                    [friendUid]: false,
                }));
            }
        };

        for (const friend of friends) {
            window.addEventListener("click", (e) =>
                handleOutsideClick(e, friend.friendUid)
            );
        }

        // Cleanup the event listeners when the component unmounts
        return () => {
            for (const friend of friends) {
                window.removeEventListener("click", (e) =>
                    handleOutsideClick(e, friend.friendUid)
                );
            }
        };
    }, [friends]);

    const handleUnfriend = (friendUid) => {
        unfriendUser(user.uid, friendUid);
        setFriends((prevFriends) => prevFriends.filter((friend) => friend.friendUid !== friendUid));
    };

    return (
        <div className='friendspageLeftbar_Allfriends'>
            <div className="friendspageLeftbar_AllfriendsTop">
                <div className='friendspageLeftbar_AllfriendsTop_Top'>
                    <NavLink to="/friendpage">
                        <KeyboardBackspaceIcon />
                    </NavLink>
                    <div className='texts'>
                        <p id='mainText'>Friends</p>
                        <p id='sideText'>All Friends</p>
                    </div>
                </div>

                <div className="friendspageLeftbar_AllfriendsTop_Bottom">
                    <div className='searchInp'>
                        <SearchIcon />
                        <input type="text" placeholder='Search Friends' />
                    </div>
                </div>
            </div>

            <hr />

            <div className="friendspageLeftbar_AllfriendsBottom">
                <p id='friendsCount'>{friends.length} friend(s)</p>
                {friends.map((friend) => (
                    <div className='friendsList' key={friend.friendUid}>
                        <div className='friendsListInfo'>
                            <Avatar src={friend.photoURL} />
                            <p id="friendName">{friend.username}</p>
                        </div>

                        <div className={`unfriend ${dialogVisibility[friend.friendUid] ? 'clicked' : ''}`}>
                            <MoreHorizIcon
                                onClick={() => toggleDialog(friend.friendUid)}
                                ref={(ref) => (dialogBoxRefs.current[friend.friendUid] = ref)}
                            />

                            {dialogVisibility[friend.friendUid] && (
                                <div className="dialogBox">
                                    <button onClick={() => handleUnfriend(friend.friendUid)}>Unfriend</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}

export { fetchFriendsData, fetchFriendDetailsData };
export default FriendsPage_Leftbar_AllFriends;