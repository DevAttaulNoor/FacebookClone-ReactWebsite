import '../../CSS/HomePage/HomePage_Rightbar_FriendsList.css'
import React, { useEffect, useState } from 'react'
import { Avatar } from '@mui/material';
import { useStateValue } from '../BackendRelated/StateProvider'
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendsPage/FriendsPage_AllFriends_Leftbar';
import HomePage_Messages from '../HomePage/HomePage_Messages';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Skeleton from '../Skeletons/Skeleton';
import Skeleton_Option from '../Skeletons/Skeleton_Option';

function HomePage_Rightbar_FriendsList() {
    const [{ user }] = useStateValue();
    const [friends, setFriends] = useState([]);
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
            fetchFriendDetailsData(friends, setFriends);
        }
    }, [friends]);


    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulating loading delay
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='homepageRightbarFriendList'>
            {isLoading ? (
                <div>
                    <Skeleton type='fullText' />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                    <Skeleton_Option />
                </div>
            ) : (
                <>
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
                        {friends.map((friend) => (
                            <div
                                className="homepageRightbarFriendList_BottomOption"
                                key={friend.id}
                                onClick={() => openFriendMessageBox(friend)}
                            >
                                <Avatar src={friend.photoURL} />
                                <p>{friend.username}</p>
                            </div>
                        ))}
                    </div>

                    <HomePage_Messages handleSelectedFriend={selectedFriend} closeFriendBox={closeFriendMessageBox} />
                </>
            )}
        </div>
    )
}

export default HomePage_Rightbar_FriendsList