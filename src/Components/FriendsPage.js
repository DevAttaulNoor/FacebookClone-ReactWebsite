import "../CSS/FriendsPage.css"
import React, { useEffect, useState } from 'react';
import { db } from "./Firebase";
import FriendsCard from './FriendsCard'

function FriendsPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('Users').onSnapshot(snapshot => {
            const userData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userData);
        });
        return () => {
            // Unsubscribe from the snapshot listener when the component unmounts.
            unsubscribe();
        }
    }, []);

    return (
        <div className='friends'>
            <div className="friendsleftbar">
                <h1>Friends</h1>
                <a href="">Home</a>
                <a href="">Friend Requests</a>
                <a href="">All friends</a>
            </div>
            <div className='friendsMain'>
                <div className="friendsMain_top">
                    <h2>People you may know</h2>
                </div>
                <div className="friendsMain_bottom">
                    {users.map((user) => (
                        <FriendsCard key={user.id} user={user} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FriendsPage