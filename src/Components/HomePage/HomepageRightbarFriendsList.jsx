import '../../CSS/HomePage/HomepageRightbarFriendsList.css'
import React from 'react';
import { Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMsgFriend, setMsgFriendBoxVisibility } from '../../Redux/messageSlice';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function HomepageRightbarFriendsList() {
    const dispatch = useDispatch();
    const friendsData = useSelector((state) => state.data.friends.friendsData);

    const handleMsgFriendBox = (friend) => {
        dispatch(setMsgFriend(friend));
        dispatch(setMsgFriendBoxVisibility(true));
    };

    return (
        <div className='homepageRightbarFriendsList'>
            <div className="homepageRightbarFriendsList_Top">
                <div className="homepageRightbarFriendsList_TopLeft">
                    <h4>Contacts</h4>
                </div>
                <div className="homepageRightbarFriendsList_TopRight">
                    <SearchIcon />
                    <MoreHorizIcon />
                </div>
            </div>
            <div className="homepageRightbarFriendsList_Bottom">
                {friendsData.length > 0 ? (
                    <>
                        {friendsData.map((friend, index) => (
                            <div className="homepageRightbarFriendsList_BottomOption" key={index} onClick={() => handleMsgFriendBox(friend)}>
                                <Avatar src={friend.photoURL} />
                                <p>{friend.username}</p>
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="homepageRightbarFriendsList_BottomOption">
                        <NavLink to={'/friendpage/'}>
                            <AddIcon className='addIcon' />
                            <p>Find some friends</p>
                        </NavLink>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomepageRightbarFriendsList;