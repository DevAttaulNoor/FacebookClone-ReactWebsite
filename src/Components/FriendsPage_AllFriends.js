import React, { useEffect, useState } from 'react';
import { db } from './Firebase';
import { useStateValue } from './StateProvider';
import "../CSS/FriendsCard.css";

function FriendsPage_AllFriends() {
    const [{ user }, dispatch] = useStateValue();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                // Create a reference to the "Friends" subcollection within the current user's document
                const friendsCollection = db.collection('Users').doc(user.uid).collection('Friends');

                // Query the Friends subcollection
                const querySnapshot = await friendsCollection.get();

                const userFriends = [];

                querySnapshot.forEach((doc) => {
                    const friendData = doc.data();
                    userFriends.push({
                        friendUid: friendData.friendUid,
                        // You can fetch other user details here using a similar approach
                    });
                });

                setFriends(userFriends);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [user.uid]);

    useEffect(() => {
        // Use a separate useEffect to fetch detailed user info for each friend
        const fetchFriendDetails = async () => {
            const friendDetailsPromises = friends.map(async (friend) => {
                try {
                    // Create a reference to the friend's document in the "Users" collection
                    const friendDoc = await db.collection('Users').doc(friend.friendUid).get();

                    if (friendDoc.exists) {
                        // Extract friend's details and add them to the friend object
                        const friendDetails = friendDoc.data();
                        return {
                            ...friend,
                            username: friendDetails.username || 'No Display Name',
                            photoURL: friendDetails.photoURL || '', // Provide a default photo URL
                            // Add more fields as needed
                        };
                    }
                } catch (error) {
                    console.error('Error fetching friend details:', error);
                }
                return null; // Return null for friends with missing details
            });

            const updatedFriends = await Promise.all(friendDetailsPromises);
            setFriends(updatedFriends.filter((friend) => friend !== null));
        };

        if (friends.length > 0) {
            fetchFriendDetails();
        }
    }, [friends]);

    return (
        <div>
            <h1>All Friends</h1>
            {friends.map((friend) => (
                <div className='friendsCard'>
                    <div className="friendsCard_top">
                        <img src={friend.photoURL} alt="" />
                    </div>
                    <div className="friendsCard_bottom">
                        <p id="friendName">{friend.username}</p>
                        <p id="friendMutual">Mutual friends</p>
                    </div>
                </div>
            ))}
        </div>

    );
}

export default FriendsPage_AllFriends;
