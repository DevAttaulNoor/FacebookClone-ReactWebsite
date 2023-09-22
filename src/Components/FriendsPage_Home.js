import "../CSS/FriendsPage.css";
import React, { useEffect, useState } from 'react';
import { db } from "./Firebase";
import FriendsCard from './FriendsCard';
import { useStateValue } from './StateProvider';

function FriendsPage_Home() {
    const [{ user }] = useStateValue(); // Get the logged-in user from your state

    const [users, setUsers] = useState([]);
    const [userFriends, setUserFriends] = useState([]); // Store the logged-in user's friend UIDs
    const [friendRequests, setFriendRequests] = useState([]); // Store the logged-in user's pending friend requests

    useEffect(() => {
        // Fetch the logged-in user's friend UIDs from the "Friends" subcollection
        const fetchUserFriends = async () => {
            try {
                const friendsCollection = db.collection('Users').doc(user?.uid).collection('Friends');
                const querySnapshot = await friendsCollection.get();
                const friendUids = querySnapshot.docs.map(doc => doc.data().friendUid);
                setUserFriends(friendUids);
            } catch (error) {
                console.error('Error fetching user friends:', error);
            }
        };

        // Fetch the logged-in user's pending friend requests
        const fetchFriendRequests = async () => {
            try {
                const friendRequestsCollection = db.collection('Users').doc(user?.uid).collection('friendRequests');
                const querySnapshot = await friendRequestsCollection.where('status', '==', 'pending').get();
                const pendingRequests = querySnapshot.docs.map(doc => doc.data().receiverUid);
                setFriendRequests(pendingRequests);
            } catch (error) {
                console.error('Error fetching pending friend requests:', error);
            }
        };

        const unsubscribe = db.collection('Users').onSnapshot(snapshot => {
            const userData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userData);
        });

        fetchUserFriends();
        fetchFriendRequests();

        return () => {
            // Unsubscribe from the snapshot listener when the component unmounts.
            unsubscribe();
        }
    }, [user?.uid]);

    return (
        <div>
            <div className="friendsMain_bottom">
                {users.map((friend) => (
                    // Only render the friend card if it's not the logged-in user
                    friend.id !== user?.uid &&
                    // Also, make sure the friend is not in the list of user's friends
                    !userFriends.includes(friend.id) &&
                    // Additionally, ensure that the friend is not in the list of pending friend requests
                    !friendRequests.includes(friend.id) && (
                        <FriendsCard key={friend.id} user={friend} />
                    )
                ))}
            </div>
        </div>
    )
}

export default FriendsPage_Home;
