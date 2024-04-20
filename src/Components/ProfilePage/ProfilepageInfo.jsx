import '../../CSS/ProfilePage/ProfilepageInfo.css';
import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/firebase';

function ProfilepageInfo({ userData }) {
    const [bio, setBio] = useState('');

    useEffect(() => {
        const docRef = db.collection("Users")
            .doc(userData.uid)
            .collection("Intro")
            .doc(userData.uid);

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
    }, [userData.uid]);

    return (
        <div className='ProfilePageInfo'>
            <h3>Intro</h3>
            <p id='bioText'>{bio.introText}</p>
        </div >
    )
}

export default ProfilepageInfo;