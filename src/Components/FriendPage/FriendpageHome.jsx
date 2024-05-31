import '../../CSS/FriendPage/FriendpageHome.css'
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { db } from '../../Firebase/firebase';
import FriendCard from './FriendCard';

function FriendpageHome() {
    const user = useSelector((state) => state.data.user.user);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        const fetchFilteredUsers = async () => {
            try {
                const friendsCollection = db.collection('Users').doc(user.uid).collection('Friends');
                const friendRequestsCollection = db.collection('Users').doc(user.uid).collection('friendRequests');

                const [friendsSnapshot, friendRequestsSnapshot] = await Promise.all([
                    friendsCollection.get(),
                    friendRequestsCollection.where('status', '==', 'pending').get(),
                ]);

                const friendUids = friendsSnapshot.docs.map(doc => doc.data().friendUid);
                const pendingRequests = friendRequestsSnapshot.docs.map(doc => doc.data().senderUid);

                const userSnapshot = await db.collection('Users').get();

                const userData = userSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const filteredUsers = userData.filter(friend => (
                    friend.id !== user.uid &&
                    !friendUids.includes(friend.id) &&
                    !pendingRequests.includes(friend.id)
                ));

                setFilteredUsers(filteredUsers);
            }

            catch (error) {
                console.error('Error fetching and filtering data:', error);
            }
        };

        fetchFilteredUsers();
    }, [user?.uid]);

    return (
        <div className="friendpageHome">
            {filteredUsers.length > 0 ? (
                <>
                    <div className="friendpageHomeTop">
                        <p>People you may know</p>
                    </div>

                    <div className="friendpageHomeBottom">
                        {filteredUsers.map((friend) => (
                            <FriendCard key={friend.id} user={friend} />
                        ))}
                    </div>
                </>
            ) : (
                <div className='noReqsNote'>
                    <h3>When you have friend requests or suggestions, you'll see them here.</h3>
                </div>
            )}
        </div>
    )
}

export default FriendpageHome;