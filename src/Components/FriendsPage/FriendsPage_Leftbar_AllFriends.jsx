import '../../CSS/FriendsPage/FriendsPage_Leftbar_AllFriends.css'
import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, IconButton } from '@mui/material';
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
                        <IconButton>
                            <div className={`unfriend ${dialogVisibility[friend.friendUid] ? 'clicked' : ''}`}>
                                <MoreHorizIcon onClick={() => toggleDialog(friend.friendUid)} ref={(ref) => (dialogBoxRefs.current[friend.friendUid] = ref)} />
                                {dialogVisibility[friend.friendUid] && (
                                    <div className="dialogBox">
                                        <button>Unfriend</button>
                                    </div>
                                )}
                            </div>
                        </IconButton>
                    </div>
                ))}
            </div>
        </div >
    )
}

export { fetchFriendsData, fetchFriendDetailsData };
export default FriendsPage_Leftbar_AllFriends