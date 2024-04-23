import "../../CSS/ProfilePage/ProfilePage.css";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Blurhash } from 'react-blurhash';
import { db } from "../../Firebase/firebase";
import ProfilepageComponents from "./ProfilepageComponents";
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function ProfilePage() {
    const { userid } = useParams();
    const friendFriends = useSelector((state) => state.data.friends.friendFriends);
    const friendFriendsData = useSelector((state) => state.data.friends.friendFriendsData);
    const selectedFriendFriends = friendFriends.filter(friend => friend.friendUid !== userid);
    console.log(selectedFriendFriends)

    return (
        <div className="ProfilePage">
            <div className="ProfilePage_Top">
                <div className="ProfilePage_TopCoverSection">
                    <img
                        src={friendFriendsData.coverphotoUrl}
                        alt="Cover"
                    />
                </div>

                <div className="ProfilePage_TopProfileSection">
                    <div className="ProfilePage_TopProfileSection_Left">
                        <div className="ProfilePage_TopProfileSection_LeftPhoto">
                            <img src={friendFriendsData.photoURL} alt="Profile" />
                        </div>

                        <div className="ProfilePage_TopProfileSection_LeftInfo">
                            <h3>{friendFriendsData.username}</h3>
                            <p>{friendFriends.length} friends</p>
                        </div>
                    </div>

                    <div className="ProfilePage_TopProfileSection_Right">
                        <div className="ProfilePage_TopProfileSection_RightOption" id="addStoryBtn">
                            <AddIcon />
                            <p>Message</p>
                        </div>

                        <div className="ProfilePage_TopProfileSection_RightOption" id="editProfileBtn">
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/OR6SzrfoMFg.png" alt="" />
                            <p>Add friend</p>
                        </div>

                        <div className="ProfilePage_TopProfileSection_RightOption" id="arrowBtn">
                            <KeyboardArrowDownIcon />
                        </div>
                    </div>
                </div>

                <div className="ProfilePage_TopComponents">
                    <div className="ProfilePage_TopComponents_Left">
                        <NavLink to={`/profilepage/${userid}/post`} activeclassname="active">
                            <div className='ProfilePage_TopComponents_LeftOption'>Posts</div>
                        </NavLink>

                        <NavLink to={`/profilepage/${userid}/about`} activeclassname="active">
                            <div className='ProfilePage_TopComponents_LeftOption'>About</div>
                        </NavLink>

                        <NavLink to={`/profilepage/${userid}/friend`} activeclassname="active">
                            <div className='ProfilePage_TopComponents_LeftOption'>Friends</div>
                        </NavLink>

                        <NavLink to={`/profilepage/${userid}/photo`} activeclassname="active">
                            <div className='ProfilePage_TopComponents_LeftOption'>Photos</div>
                        </NavLink>

                        <NavLink to={`/profilepage/${userid}/video`} activeclassname="active">
                            <div className='ProfilePage_TopComponents_LeftOption'>Videos</div>
                        </NavLink>

                        <div className="ProfilePage_TopComponents_LeftOption" id="moreOption">
                            <p>More</p>
                            <ArrowDropDownIcon />
                        </div>
                    </div>

                    <div className="ProfilePage_TopComponents_Right">
                        <MoreHorizIcon />
                    </div>
                </div>
            </div>

            <div className="ProfilePage_Bottom">
                <ProfilepageComponents />
            </div>
        </div>
    );
}

export default ProfilePage;