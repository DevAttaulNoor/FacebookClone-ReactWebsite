import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserPage_Components_About from './UserPage_Components_About'
import UserPage_Components_Friends from './UserPage_Components_Friends'
import UserPage_Components_Photos from './UserPage_Components_Photos'
import UserPage_Components_Music from './UserPage_Components_Music'
import UserPage_Components_Videos from './UserPage_Components_Videos'
import UserPage_Components_Films from './UserPage_Components_Films'
import UserPage_Components_Checkins from './UserPage_Components_Checkins'
import UserPage_Components_Post from './UserPage_Components_Post'

function UserPage_Components() {
    return (
        <div className='UserpageComponents'>
            <Routes>
                <Route path="/post" element={<UserPage_Components_Post />} />
                <Route path="/about" element={<UserPage_Components_About />} />
                <Route path="/friend" element={<UserPage_Components_Friends />} />
                <Route path="/photo" element={<UserPage_Components_Photos />} />
                <Route path="/video" element={<UserPage_Components_Videos />} />
                <Route path="/music" element={<UserPage_Components_Music />} />
                <Route path="/film" element={<UserPage_Components_Films />} />
                <Route path="/checkin" element={<UserPage_Components_Checkins />} />
            </Routes>
        </div>
    )
}

export default UserPage_Components