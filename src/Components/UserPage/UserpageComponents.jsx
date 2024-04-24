import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UserpageComponentsPost from './UserpageComponentsPost'
import UserpageComponentsAbout from './UserpageComponentsAbout'
import UserpageComponentsFriends from './UserpageComponentsFriends'
import UserpageComponentsPhotos from './UserpageComponentsPhotos'
import UserpageComponentsVideos from './UserpageComponentsVideos'

function UserpageComponents() {
    return (
        <div className='userpageComponents'>
            <Routes>
                <Route path="/post" element={<UserpageComponentsPost />} />
                <Route path="/about" element={<UserpageComponentsAbout />} />
                <Route path="/friend" element={<UserpageComponentsFriends />} />
                <Route path="/photo" element={<UserpageComponentsPhotos />} />
                <Route path="/video" element={<UserpageComponentsVideos />} />
            </Routes>
        </div>
    )
}

export default UserpageComponents;