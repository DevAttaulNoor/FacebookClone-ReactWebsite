import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProfilePage_Components_Post from './ProfilePage_Components_Post'
import ProfilePage_Components_About from './ProfilePage_Components_About'
import ProfilePage_Components_Friends from './ProfilePage_Components_Friends'
import ProfilePage_Components_Videos from './ProfilePage_Components_Videos'
import ProfilePage_Components_Photos from './ProfilePage_Components_Photos'

function ProfilePage_Components({userData}) {
    return (
        <div className='ProfilePageComponents'>
            {/* {console.log(userData)} */}
            <Routes>
                <Route path="/post" element={<ProfilePage_Components_Post userData={userData} />} />
                <Route path="/about" element={<ProfilePage_Components_About userData={userData} />} />
                <Route path="/friend" element={<ProfilePage_Components_Friends userData={userData} />} />
                <Route path="/photo" element={<ProfilePage_Components_Photos userData={userData} />} />
                <Route path="/video" element={<ProfilePage_Components_Videos userData={userData} />} />
            </Routes>
        </div>
    )
}

export default ProfilePage_Components