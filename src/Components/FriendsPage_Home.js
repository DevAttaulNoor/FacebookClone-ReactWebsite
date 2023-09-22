import "../CSS/FriendsPage.css"
import React, { useEffect, useState } from 'react';
import { db } from "./Firebase";
import FriendsCard from './FriendsCard';
import { useStateValue } from './StateProvider'; // Import your state context

function FriendsPage_Home() {
    const [{ user }] = useStateValue(); // Get the logged-in user from your state

    const [users, setUsers] = useState([]);
    const [userFriends, setUserFriends] = useState([]); // Store the logged-in user's friend UIDs

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

        const unsubscribe = db.collection('Users').onSnapshot(snapshot => {
            const userData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userData);
        });

        fetchUserFriends();

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
                    !userFriends.includes(friend.id) && (
                        <FriendsCard key={friend.id} user={friend} />
                    )
                ))}
            </div>
        </div>
    )
}

export default FriendsPage_Home;
