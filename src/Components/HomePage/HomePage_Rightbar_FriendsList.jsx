import '../../CSS/HomePage/HomePage_Rightbar_FriendsList.css'
import React, { useEffect, useState } from 'react'
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux'
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendsPage/FriendsPage_AllFriends_Leftbar';
import HomePage_Messages from '../HomePage/HomePage_Messages';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Skeleton from '../Skeletons/Skeleton';

function HomePage_Rightbar_FriendsList() {
    const user = useSelector((state) => state.data.user.user);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFriend, setSelectedFriend] = useState();
    const [friendMessageBox, setFriendMessageBox] = useState(false);

    const openFriendMessageBox = (friend) => {
        setSelectedFriend(friend);
        setFriendMessageBox(true);
    };

    const closeFriendMessageBox = () => {
        setSelectedFriend(null);
        setFriendMessageBox(false);
    }

    useEffect(() => {
        // Fetch friends data when user.uid changes
        fetchFriendsData(user.uid, setFriends);
    }, [user.uid]);

    useEffect(() => {
        // Fetch friend details when friends array changes
        if (friends.length > 0) {
            fetchFriendDetailsData(friends, setFriends).then(() => setLoading(false));
        }
    }, [friends]);

    return (
        <div className='homepageRightbarFriendList'>
            <div className="homepageRightbarFriendList_Top">
                <div className="homepageRightbarFriendList_TopLeft">
                    <h4>Contacts</h4>
                </div>

                <div className="homepageRightbarFriendList_TopRight">
                    <SearchIcon />
                    <MoreHorizIcon />
                </div>
            </div>

            <div className="homepageRightbarFriendList_Bottom">
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div className="homepageRightbarFriendList_BottomOption" key={index}>
                            <Skeleton type='avatar' />
                            <Skeleton type='halfhalfText' />
                        </div>
                    ))
                ) : (
                    friends.map((friend, index) => (
                        <div
                            className="homepageRightbarFriendList_BottomOption"
                            key={index}
                            onClick={() => openFriendMessageBox(friend)}
                        >
                            <Avatar src={friend.photoURL} />
                            <p>{friend.username}</p>
                        </div>
                    ))
                )}
            </div>

            <HomePage_Messages handleSelectedFriend={selectedFriend} closeFriendBox={closeFriendMessageBox} />
        </div>
    )
}

export default HomePage_Rightbar_FriendsList