import '../../CSS/FriendPage/FriendpageAllFriends.css'
import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { NavLink, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFriend, setSelectedFriend } from '../../Redux/friendSlice';
import { db } from '../../Firebase/firebase';
import ProfilePage from '../ProfilePage/ProfilePage'
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

function FriendpageAllFriends() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.data.user.user);
    const friends = useSelector((state) => state.data.friends.friends);
    const friendsData = useSelector((state) => state.data.friends.friendsData);
    const [settingBoxVisibility, setSettingBoxVisibility] = useState({});
    const settingBoxRef = useRef({});

    const handleFriendSelection = (friendUid) => {
        sessionStorage.setItem('selectedFriend', JSON.stringify({ friendUid: friendUid }));
        dispatch(setSelectedFriend(friendUid));
    }

    const toggleSettingBox = (friendUid) => {
        setSettingBoxVisibility((prevVisibility) => ({
            ...prevVisibility,
            [friendUid]: !prevVisibility[friendUid],
        }));
    };

    const handleUnfriend = async (uid, friendUid) => {
        try {
            const userRef = db.collection('Users').doc(uid);
            const friendRef = db.collection('Users').doc(friendUid);

            // Get the list of friends for the logged-in user
            const userFriendsQuery = await userRef.collection('Friends').where('friendUid', '==', friendUid).get();

            // Get the list of friends for the friend
            const friendFriendsQuery = await friendRef.collection('Friends').where('friendUid', '==', uid).get();

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
                .where('receiverUid', '==', uid)
                .get();

            const userFriendRequestQueryReceiver = await userRef.collection('friendRequests')
                .where('receiverUid', '==', friendUid)
                .where('senderUid', '==', uid)
                .get();

            const friendFriendRequestQuerySender = await friendRef.collection('friendRequests')
                .where('senderUid', '==', uid)
                .where('receiverUid', '==', friendUid)
                .get();

            const friendFriendRequestQueryReceiver = await friendRef.collection('friendRequests')
                .where('receiverUid', '==', uid)
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

            dispatch(removeFriend(friendUid))
        }

        catch (error) {
            console.error('Error unfriending user:', error);
        }
    }

    useEffect(() => {
        const handleOutsideClick = (e, friendUid) => {
            if (
                settingBoxRef.current[friendUid] &&
                !settingBoxRef.current[friendUid].contains(e.target)
            ) {
                setSettingBoxVisibility((prevVisibility) => ({
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

    return (
        <div className='friendpageAllFriends'>
            <div className='friendpageAllFriendsLeftbar'>
                <div className="friendpageAllFriendsLeftbarTop">
                    <NavLink to="/friendpage/">
                        <KeyboardBackspaceIcon />
                    </NavLink>

                    <div className='heading'>
                        <p id='mainText'>Friends</p>
                        <p id='sideText'>All Friends</p>
                    </div>
                </div>

                <div className="friendpageAllFriendsLeftbarMiddle searchContainer">
                    <SearchIcon />
                    <input type="text" placeholder='Search Friends' />
                </div>

                <div className="friendpageAllFriendsLeftbarBottom">
                    <p id='friendsCount'>{friendsData.length} friend(s)</p>
                    {friendsData.map((friend) => (
                        <div className='friendsList' key={friend.friendUid}>
                            <div className='friendsListLeft'>
                                <NavLink to={`/friendpage/allFriends/profilepage/${friend.friendUid}/post`} onClick={() => handleFriendSelection(friend.friendUid)}>
                                    <Avatar src={friend.photoURL} />
                                    <p>{friend.username}</p>
                                </NavLink>
                            </div>

                            <div className={`friendsListRight ${settingBoxVisibility[friend.friendUid] ? 'clicked' : ''}`}>
                                <MoreHorizIcon
                                    onClick={() => toggleSettingBox(friend.friendUid)}
                                    ref={(ref) => (settingBoxRef.current[friend.friendUid] = ref)}
                                />

                                {settingBoxVisibility[friend.friendUid] && (
                                    <div className="settingBox">
                                        <button onClick={() => handleUnfriend(user.uid, friend.friendUid)}>Unfriend</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div >

            <div className='friendpageAllFriendsMain'>
                <Routes>
                    <Route path="profilepage/:selectedFriend/*" element={<ProfilePage />} />
                </Routes>
            </div>
        </div>
    )
}

export default FriendpageAllFriends;