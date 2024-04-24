import '../../CSS/ProfilePage/ProfilepageInfo.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';

function ProfilepageInfo() {
    const selectedFriend = useSelector((state) => state.data.friends.selectedFriend);
    const [bio, setBio] = useState('');

    useEffect(() => {
        const docRef = db.collection("Users")
            .doc(selectedFriend)
            .collection("Intro")
            .doc(selectedFriend);

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
    }, [selectedFriend]);

    return (
        <div className='profilePageInfo'>
            <h3>Intro</h3>
            <p id='bioText'>{bio.introText}</p>
        </div >
    )
}

export default ProfilepageInfo;