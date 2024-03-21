import "../../CSS/ProfilePage/ProfilePage.css";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from 'react-router-dom'
import { db } from "../BackendRelated/Firebase";
import { Blurhash } from 'react-blurhash';
import { fetchFriendsData, fetchFriendDetailsData } from '../FriendsPage/FriendsPage_AllFriends_Leftbar';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ProfilePage_Components from "./ProfilePage_Components";

function ProfilePage() {
    const { userid } = useParams();
    const [friends, setFriends] = useState([]);
    const [userData, setUserData] = useState('');
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDoc = await db.collection('Users').doc(userid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    setUserData(userData);
                } else {
                    console.log("User not found");
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
    
        fetchUser();
    }, [userid]);

    useEffect(() => {
        fetchFriendsData(userData.uid, setFriends);
    }, [userData.uid]);

    useEffect(() => {
        if (friends.length > 0) {
            fetchFriendDetailsData(friends, setFriends);
        }
    }, [friends]);

    useEffect(() => {
        const img = new Image();
        img.src = userData.coverphotoUrl;
        img.onload = () => {
            setImageLoaded(true);
        };
    }, [userData.coverphotoUrl]);

    return (
        <div className="ProfilePage">
            <div className="ProfilePage_Top">
                <div className="ProfilePage_TopCoverSection">
                    {imageLoaded ? (
                        <img
                            src={userData.coverphotoUrl}
                            alt="Cover"
                        />
                    ) : (
                        <Blurhash
                            hash={"LEHV6nWB2yk8pyo0adR*.7kCMdnj"}
                            width={995}
                            height={370}
                        />
                    )}
                </div>

                <div className="ProfilePage_TopProfileSection">
                    <div className="ProfilePage_TopProfileSection_Left">
                        <div className="ProfilePage_TopProfileSection_LeftPhoto">
                            <img src={userData.photoURL} alt="Profile" />
                        </div>

                        <div className="ProfilePage_TopProfileSection_LeftInfo">
                            <h3>{userData.username}</h3>
                            <p>{friends.length} friends</p>
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
                <ProfilePage_Components userData={userData}/>
            </div>
        </div>
    );
}

export default ProfilePage;