import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProfilepageComponentsPost from './ProfilepageComponentsPost';
import ProfilepageComponentsAbout from './ProfilepageComponentsAbout';
import ProfilepageComponentsPhotos from './ProfilepageComponentsPhotos';
import ProfilepageComponentsVideos from './ProfilepageComponentsVideos';
import ProfilepageComponentsFriends from './ProfilepageComponentsFriends';

function ProfilepageComponents() {
    return (
        <div className='profilePageComponents'>
            <Routes>
                <Route path="/post" element={<ProfilepageComponentsPost />} />
                <Route path="/about" element={<ProfilepageComponentsAbout />} />
                <Route path="/friend" element={<ProfilepageComponentsFriends />} />
                <Route path="/photo" element={<ProfilepageComponentsPhotos />} />
                <Route path="/video" element={<ProfilepageComponentsVideos />} />
            </Routes>
        </div>
    )
}

export default ProfilepageComponents;