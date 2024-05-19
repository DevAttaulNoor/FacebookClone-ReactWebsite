import '../../CSS/HomePage/ReelPage.css'
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import { Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';

function ReelPage() {
    const user = useSelector((state) => state.data.user.user);
    const [reels, setReels] = useState([]);

    useEffect(() => {
        db.collection("Reels").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
            const reelsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setReels(reelsData);
        });
    }, []);

    return (
        <div className="reelpage">
            <div className='reelpageLeftbar'>
                <div className="reelpageLeftbarTop">
                    <p>Stories</p>
                    <SettingsIcon />
                </div>

                <div className="reelpageLeftbarMiddle">
                    <h5>Your story</h5>

                    <div className='userInfoContainer'>
                        <div className='userInfo'>
                            <img src={user.photoURL} alt="" />
                            <div>
                                <h5>{user.username}</h5>
                                <p>timestamp</p>
                            </div>
                        </div>
                        <AddIcon />
                    </div>
                </div>
            </div>

            <div className='reelpageMain'>
                {reels.map((reelContent) => (
                    <div
                        key={reelContent.id}
                        className="reel"
                        style={{
                            backgroundImage: `url(${reelContent.reel[[reelContent.reel.length - 1]].background})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        <Avatar src={reelContent.photoURL} />
                        <p>{reelContent.username}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ReelPage