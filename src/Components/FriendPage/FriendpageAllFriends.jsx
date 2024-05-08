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
                                        <div className="settingBoxOption">
                                            <div className="settingBoxOptionLeft">
                                                <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor"><g fill-rule="evenodd" transform="translate(-446 -398)"><g><path fill-rule="nonzero" d="M97.237 212.031c.033 1.076 1.087 1.77 2.059 1.34l1.831-.807c1.04.285 1.955.436 2.873.436 5.645 0 10-4.227 10-9.778 0-5.54-4.345-9.722-10-9.722s-10 4.181-10 9.722c0 2.767 1.086 5.266 3.002 7.056l.153.14c.023.02.043.04.06.057l.023.024v1.532zm1.5-1.645c-.012-.429-.199-.724-.504-1.014l-.078-.072c-1.693-1.514-2.655-3.665-2.655-6.078 0-4.7 3.66-8.222 8.5-8.222s8.5 3.523 8.5 8.222c0 4.712-3.673 8.278-8.5 8.278-.767 0-1.556-.13-2.479-.384a1.489 1.489 0 0 0-.996.074l-1.788.789v-1.593z" transform="translate(352 204.5)"></path><path d="m109.924 200.978-2.898 4.634a1.474 1.474 0 0 1-2.14.398l-2.305-1.743a.588.588 0 0 0-.712.002l-3.113 2.381c-.416.318-.958-.183-.68-.628l2.898-4.633a1.473 1.473 0 0 1 2.14-.398l2.304 1.742c.212.16.503.16.713-.002l3.113-2.38c.416-.319.958.183.68.627" transform="translate(352 204.5)"></path></g></g></svg>
                                            </div>
                                            <div className="settingBoxOptionRight">
                                                <h5>{`Message ${friend.username}`}</h5>
                                                <p>{`Write something to ${friend.username}`}</p>
                                            </div>
                                        </div>

                                        <div className="settingBoxOption" onClick={() => handleUnfriend(user.uid, friend.friendUid)}>
                                            <div className="settingBoxOptionLeft">
                                                <i id='unfriendIcon'></i>
                                            </div>
                                            <div className="settingBoxOptionRight">
                                                <h5>{`Unfriend ${friend.username}`}</h5>
                                                <p>{`Remove ${friend.username} as a friend`}</p>
                                            </div>
                                        </div>
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