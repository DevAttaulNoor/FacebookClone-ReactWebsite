import "../../CSS/ProfilePage/ProfilePage.css";
import React from "react";
import { Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from 'react-router-dom';
import ProfilepageComponents from "./ProfilepageComponents";
import LazyLoadingImage from "../../Assets/Utility/LazyLoadingImage";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function ProfilePage() {
    const location = useLocation();
    const friends = useSelector((state) => state.data.friends.friends);
    const friendFriendsData = useSelector((state) => state.data.friends.friendFriendsData);
    const selectedFriend = useSelector((state) => state.data.friends.selectedFriend);
    const selectedFriendData = useSelector((state) => state.data.friends.selectedFriendData);
    const isFriend = friends.some(friend => friend.friendUid === selectedFriend);
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
                        {isFriend ? (
                            <div className="profilePageTop_ProfileSectionRightOption" id="friendBtn">
                                <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yF/r/5nzjDogBZbf.png?_nc_eui2=AeFEAd2Gr8hqE5iFj014M69jr5jr7d_7UXGvmOvt3_tRcWVQq6CW7Abth79PUUZ9xzNkb2tM1DuXqx03_2RdecH7" alt="" />
                                <p>Friends</p>
                            </div>
                        ) : (
                            <div className="profilePageTop_ProfileSectionRightOption" id="friendBtn">
                                <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yK/r/r2FA830xjtI.png?_nc_eui2=AeF6jL-mPfHxp3Q2l3_zlRZ1LvJBHXhZHNwu8kEdeFkc3G8XZZMwaO-3gDeqPWuSSoBt_sMKaW0V310y8Er_FfN_" alt="" />
                                <p>Add friend</p>
                            </div>
                        )}

                        <div className="profilePageTop_ProfileSectionRightOption" id="messageBtn">
                            <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/YjBUcSAL8TC.png?_nc_eui2=AeF2qGdiV5I3eMpACVj57_XQYWMzpYRsku5hYzOlhGyS7gU7w4tIet3x6nGKruTMjeogVqCkMTBSFjIY9O41YKIk" alt="" />
                            <p>Message</p>
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