import '../../CSS/FriendUserPage/FriendUserPage.css'
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../BackendRelated/Firebase';
import FriendUserPage_Info from './FriendUserPage_Info'
import FriendUserPage_Photos from './FriendUserPage_Photos'
import FriendUserPage_Friends from './FriendUserPage_Friends'
import FriendUserPage_Feed from './FriendUserPage_Feed'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function FriendUserPage() {
    const { friendUid } = useParams();
    const [friendData, setFriendData] = useState(null);
    const [username, setUsername] = useState(null);
    const [coverPhotoUrl, setCoverPhotoUrl] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    useEffect(() => {
        // Function to fetch the friend's data from Firestore
        const fetchFriendData = async () => {
            try {
                const friendDoc = await db.collection('Users').doc(friendUid).get();
                if (friendDoc.exists) {
                    const friend = friendDoc.data();
                    setFriendData(friend);
                    setUsername(friend.username);
                    setCoverPhotoUrl(friend.coverphotoUrl);
                    setPhotoUrl(friend.photoURL);
                } else {
                    console.log("Friend's data not found");
                }
            } catch (error) {
                console.error('Error fetching friend data:', error);
            }
        };

        fetchFriendData();
    }, [friendUid]);

    return (
        <div className='frienduserpage'>
            <div className="coverPhotoSection">
                <img src={coverPhotoUrl} alt="Cover" />
            </div>

            <div className="profileSection">
                <div className="profileSections">
                    <div className="profileSections_left">
                        <div className="profileSections_left_left">
                            <img src={photoUrl} alt="Profile" />
                        </div>
                        <div className="profileSections_left_right">
                            <h1>{username}</h1>
                        </div>
                    </div>
                    <div className="proflieSections_right">
                        <button>Friends</button>
                        <button>Message</button>
                        <ArrowDropDownIcon />
                    </div>
                </div>

                <div className="userComponents">
                    <div className="userComponent_left">
                        <div className="component active">Posts</div>
                        <div className="component">About</div>
                        <div className="component">Friends</div>
                        <div className="component">Photos</div>
                        <div className="component">Videos</div>
                        <div className="component">Check-ins</div>
                        <div className="component">More</div>
                    </div>
                    <div className="userComponent_right">
                        <div>
                            <button>Arrow</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="frienduserpage_bottom">
                <div className="frienduserpage_bottom_left">
                    <div className="userIntro">
                        <FriendUserPage_Info />
                    </div>
                    <div className="userPhotos">
                        <FriendUserPage_Photos />
                    </div>
                    <div className="userFriends">
                        <FriendUserPage_Friends />
                    </div>
                </div>
                <div className="frienduserpage_bottom_right">
                    <div className="userFeed">
                        <FriendUserPage_Feed />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FriendUserPage