import '../../CSS/ProfilePage/ProfilepageInfo.css';
import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/firebase';
import { useSelector } from 'react-redux';

function ProfilepageInfo({ userData }) {
    const friendFriends = useSelector((state) => state.data.friends.friendFriends);
    const [bio, setBio] = useState('');

    useEffect(() => {
        const docRef = db.collection("Users")
            .doc(friendFriends.friendUid)
            .collection("Intro")
            .doc(friendFriends.friendUid);

        const unsubscribe = docRef.onSnapshot((doc) => {
            if (doc.exists) {
                setBio(doc.data());
            }

            else {
                console.log("No such document!");
            }
        });

        // Cleanup the subscription when the component is unmounted
        return () => unsubscribe();
    }, [friendFriends.friendUid]);

    return (
        <div className='ProfilePageInfo'>
            <h3>Intro</h3>
            <p id='bioText'>{bio.introText}</p>
        </div >
    )
}

export default ProfilepageInfo;