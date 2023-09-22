import "../CSS/FriendsPage.css"
import React, { useEffect, useState } from 'react';
import { db } from "./Firebase";
import FriendsCard from './FriendsCard'

function FriendsPage_Home() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = db.collection('Users').onSnapshot(snapshot => {
            const userData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userData);
            // console.log(userData)
        });
        return () => {
            // Unsubscribe from the snapshot listener when the component unmounts.
            unsubscribe();
        }
    }, []);

    return (
        <div>
            <div className="friendsMain_bottom">
                {users.map((user) => (
                    <FriendsCard key={user.id} user={user} />
                ))}
            </div>
        </div>
    )
}

export default FriendsPage_Home