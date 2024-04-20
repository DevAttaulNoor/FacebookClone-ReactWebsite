import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProfilepageComponentsPost from './ProfilepageComponentsPost';
import ProfilepageComponentsAbout from './ProfilepageComponentsAbout';
import ProfilepageComponentsPhotos from './ProfilepageComponentsPhotos';
import ProfilepageComponentsVideos from './ProfilepageComponentsVideos';
import ProfilepageComponentsFriends from './ProfilepageComponentsFriends';

function ProfilepageComponents({userData}) {
    return (
        <div className='ProfilePageComponents'>
            <Routes>
                <Route path="/post" element={<ProfilepageComponentsPost userData={userData} />} />
                <Route path="/about" element={<ProfilepageComponentsAbout userData={userData} />} />
                <Route path="/friend" element={<ProfilepageComponentsFriends userData={userData} />} />
                <Route path="/photo" element={<ProfilepageComponentsPhotos userData={userData} />} />
                <Route path="/video" element={<ProfilepageComponentsVideos userData={userData} />} />
            </Routes>
        </div>
    )
}

export default ProfilepageComponents;