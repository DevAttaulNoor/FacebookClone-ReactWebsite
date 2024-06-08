import "../../CSS/ProfilePage/ProfilePage.css";
import React from "react";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from 'react-router-dom';
import ProfilepageComponents from "./ProfilepageComponents";
import LazyLoadingImage from "../../Assets/Utility/LazyLoadingImage";
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function ProfilePage() {
    const location = useLocation();
    const friendFriendsData = useSelector((state) => state.data.friends.friendFriendsData);
    const selectedFriend = useSelector((state) => state.data.friends.selectedFriend);
    const selectedFriendData = useSelector((state) => state.data.friends.selectedFriendData);
    const baseUrl = location.pathname.includes('/friendpage/allFriends') ? '/friendpage/allFriends/profilepage' : '/profilepage';

    return (
        <div className="profilePage">
            <div className="profilePageTop">
                <div className="profilePageTop_CoverSection">
                    {selectedFriendData.coverphotoUrl ? (
                        <LazyLoadingImage
                            effect={'blur'}
                            alt={"coverPhoto"}
                            lowResSrc={selectedFriendData.coverphotoUrl}
                            highResSrc={selectedFriendData.coverphotoUrl}
                        />
                    ) : (
                        <div className="coverPhoto"></div>
                    )}
                </div>

                <div className="profilePageTop_ProfileSection">
                    <div className="profilePageTop_ProfileSectionLeft">
                        <div className="profilePhoto">
                            <Avatar src={selectedFriendData.photoURL} />
                        </div>

                        <div className="profileInfo">
                            <h3>{selectedFriendData.username}</h3>

                            <NavLink to={`${baseUrl}/${selectedFriend}/friend`}>
                                <p>{friendFriendsData.length} friends</p>
                            </NavLink>

                            <div className="friendsList">
                                {friendFriendsData.slice(0, 8).map(friends => (
                                    <NavLink to={`${baseUrl}/${selectedFriend}/friend`} key={friends.friendUid}>
                                        <div className="friendPhoto" style={{ marginRight: '-10px' }}>
                                            <Avatar src={friends.photoURL} />
                                        </div>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="profilePageTop_ProfileSectionRight">
                        <div className="profilePageTop_ProfileSectionRightOption" id="addStoryBtn">
                            <AddIcon />
                            <p>Message</p>
                        </div>

                        <div className="profilePageTop_ProfileSectionRightOption" id="editProfileBtn">
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yW/r/OR6SzrfoMFg.png" alt="" />
                            <p>Add friend</p>
                        </div>

                        <div className="profilePageTop_ProfileSectionRightOption" id="arrowBtn">
                            <KeyboardArrowDownIcon />
                        </div>
                    </div>
                </div>

                <div className="profilePageTop_Components">
                    <div className="profilePageTop_ComponentsLeft">
                        <NavLink to={`${baseUrl}/${selectedFriend}/post`} activeclassname="active">
                            <div className='profilePageTop_ComponentsLeftOption'>Posts</div>
                        </NavLink>

                        <NavLink to={`${baseUrl}/${selectedFriend}/about`} activeclassname="active">
                            <div className='profilePageTop_ComponentsLeftOption'>About</div>
                        </NavLink>

                        <NavLink to={`${baseUrl}/${selectedFriend}/friend`} activeclassname="active">
                            <div className='profilePageTop_ComponentsLeftOption'>Friends</div>
                        </NavLink>

                        <NavLink to={`${baseUrl}/${selectedFriend}/photo`} activeclassname="active">
                            <div className='profilePageTop_ComponentsLeftOption'>Photos</div>
                        </NavLink>

                        <NavLink to={`${baseUrl}/${selectedFriend}/video`} activeclassname="active">
                            <div className='profilePageTop_ComponentsLeftOption'>Videos</div>
                        </NavLink>

                        <div className="profilePageTop_ComponentsLeftOption" id="moreOption">
                            <p>More</p>
                            <ArrowDropDownIcon />
                        </div>
                    </div>

                    <div className="profilePageTop_ComponentsRight">
                        <MoreHorizIcon />
                    </div>
                </div>
            </div>

            <div className="profilePageBottom">
                <ProfilepageComponents />
            </div>
        </div>
    );
}

export default ProfilePage;