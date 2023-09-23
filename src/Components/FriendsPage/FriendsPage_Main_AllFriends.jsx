import '../../CSS/FriendsPage/FriendsPage_Main_AllFriends.css'
import React, { useEffect, useState } from 'react';
import { db } from '../BackendRelated/Firebase';
import { useStateValue } from '../BackendRelated/StateProvider';

async function fetchFriendsData(userUid, setFriends) {
    try {
        const friendsCollection = db.collection('Users').doc(userUid).collection('Friends');
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
}

async function fetchFriendDetailsData(friends, setFriends) {
    const friendDetailsPromises = friends.map(async (friend) => {
        try {
            const friendDoc = await db.collection('Users').doc(friend.friendUid).get();

            if (friendDoc.exists) {
                const friendDetails = friendDoc.data();
                return {
                    ...friend,
                    username: friendDetails.username || 'No Display Name',
                    photoURL: friendDetails.photoURL || '',
                    // Add more fields as needed
                };
            }
        } catch (error) {
            console.error('Error fetching friend details:', error);
        }
        return null;
    });

    const updatedFriends = await Promise.all(friendDetailsPromises);
    setFriends(updatedFriends.filter((friend) => friend !== null));
}

function FriendsPage_Main_AllFriends() {
    const [{ user }, dispatch] = useStateValue();
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        // Fetch friends data when user.uid changes
        fetchFriendsData(user.uid, setFriends);
    }, [user.uid]);

    useEffect(() => {
        // Fetch friend details when friends array changes
        if (friends.length > 0) {
            fetchFriendDetailsData(friends, setFriends);
        }
    }, [friends]);

    return (
        <div className="friendspageMainAllfriends">
            <div className="friendspageMainAllfriends_top">
                <p>All Friends</p>
            </div>

            <div className="friendspageMainAllfriends_bottom">
                {friends.map((friend) => (
                    <div className='friendsCard' key={friend.friendUid}>
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
        </div>
    );
}

export { fetchFriendsData, fetchFriendDetailsData };
export default FriendsPage_Main_AllFriends;