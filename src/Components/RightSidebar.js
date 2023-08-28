import React from 'react'
import '../CSS/RightSidebar.css'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Avatar } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SearchIcon from '@mui/icons-material/Search';


function RightSidebar() {
    return (
        <div className='rightsidebar'>
            <div className="rightsidebarWidget_header">
                <div className="rightsidebarWidget_headerleft">
                    <h4>Your Pages</h4>
                </div>
                <MoreHorizIcon />
            </div>

            <div className="rightsidebarWidget_body">
                <div className="rightsidebarWidget_bodyOptions">
                    <Avatar src="https://scontent.fkhi21-1.fna.fbcdn.net/v/t39.30808-6/310814345_542724527852688_2144341401642080527_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFrzVPHwLgcsa4No-wJwfKz9_tTuQ3WwJL3-1O5DdbAklvyWsBny5lLGH3Hq1M23APyWx8heFj0ihpyzjBTHDYZ&_nc_ohc=B1ZBlBwz4XYAX8V2Itf&_nc_ht=scontent.fkhi21-1.fna&oh=00_AfBh-POnNtbKrIWggQtPFD5lbovZJK0hT4Bt-qE4GNJ3qw&oe=64E95F54" />
                    <h4>Pakistan Cricket</h4>
                </div>
                <div className="rightsidebarWidget_bodyOptions ml-10">
                    <NotificationsNoneIcon />
                    <h4>1 Notification</h4>
                </div>
                <div className="rightsidebarWidget_bodyOptions ml-10">
                    <VolumeUpIcon />
                    <h4>Create Promotions</h4>
                </div>
            </div>

            <hr />

            <div className="rightsidebarWidget_header">
                <div className="rightsidebarWidget_headerleft">
                    <h4>Contact</h4>
                </div>
                <div className="rightsidebarWidget_headerright">
                    <SearchIcon />
                    <MoreHorizIcon />
                </div>
            </div>

            <div className="rightsidebarWidget_body">
                <div className="rightsidebarWidget_bodyOptions">
                    <Avatar src="https://scontent.fkhi21-1.fna.fbcdn.net/v/t39.30808-6/310814345_542724527852688_2144341401642080527_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFrzVPHwLgcsa4No-wJwfKz9_tTuQ3WwJL3-1O5DdbAklvyWsBny5lLGH3Hq1M23APyWx8heFj0ihpyzjBTHDYZ&_nc_ohc=B1ZBlBwz4XYAX8V2Itf&_nc_ht=scontent.fkhi21-1.fna&oh=00_AfBh-POnNtbKrIWggQtPFD5lbovZJK0hT4Bt-qE4GNJ3qw&oe=64E95F54" />
                    <h4>Pakistan Cricket</h4>
                </div>
                <div className="rightsidebarWidget_bodyOptions">
                    <Avatar src="https://scontent.fkhi21-1.fna.fbcdn.net/v/t39.30808-6/310814345_542724527852688_2144341401642080527_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFrzVPHwLgcsa4No-wJwfKz9_tTuQ3WwJL3-1O5DdbAklvyWsBny5lLGH3Hq1M23APyWx8heFj0ihpyzjBTHDYZ&_nc_ohc=B1ZBlBwz4XYAX8V2Itf&_nc_ht=scontent.fkhi21-1.fna&oh=00_AfBh-POnNtbKrIWggQtPFD5lbovZJK0hT4Bt-qE4GNJ3qw&oe=64E95F54" />
                    <h4>India Cricket</h4>
                </div>
                <div className="rightsidebarWidget_bodyOptions">
                    <Avatar src="https://scontent.fkhi21-1.fna.fbcdn.net/v/t39.30808-6/310814345_542724527852688_2144341401642080527_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFrzVPHwLgcsa4No-wJwfKz9_tTuQ3WwJL3-1O5DdbAklvyWsBny5lLGH3Hq1M23APyWx8heFj0ihpyzjBTHDYZ&_nc_ohc=B1ZBlBwz4XYAX8V2Itf&_nc_ht=scontent.fkhi21-1.fna&oh=00_AfBh-POnNtbKrIWggQtPFD5lbovZJK0hT4Bt-qE4GNJ3qw&oe=64E95F54" />
                    <h4>Abdul Rafay</h4>
                </div>
                <div className="rightsidebarWidget_bodyOptions">
                    <Avatar src="https://scontent.fkhi21-1.fna.fbcdn.net/v/t39.30808-6/310814345_542724527852688_2144341401642080527_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFrzVPHwLgcsa4No-wJwfKz9_tTuQ3WwJL3-1O5DdbAklvyWsBny5lLGH3Hq1M23APyWx8heFj0ihpyzjBTHDYZ&_nc_ohc=B1ZBlBwz4XYAX8V2Itf&_nc_ht=scontent.fkhi21-1.fna&oh=00_AfBh-POnNtbKrIWggQtPFD5lbovZJK0hT4Bt-qE4GNJ3qw&oe=64E95F54" />
                    <h4>Abu Bakar</h4>
                </div>
                <div className="rightsidebarWidget_bodyOptions">
                    <Avatar src="https://scontent.fkhi21-1.fna.fbcdn.net/v/t39.30808-6/310814345_542724527852688_2144341401642080527_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFrzVPHwLgcsa4No-wJwfKz9_tTuQ3WwJL3-1O5DdbAklvyWsBny5lLGH3Hq1M23APyWx8heFj0ihpyzjBTHDYZ&_nc_ohc=B1ZBlBwz4XYAX8V2Itf&_nc_ht=scontent.fkhi21-1.fna&oh=00_AfBh-POnNtbKrIWggQtPFD5lbovZJK0hT4Bt-qE4GNJ3qw&oe=64E95F54" />
                    <h4>Osama Ahmed</h4>
                </div>
                <div className="rightsidebarWidget_bodyOptions">
                    <Avatar src="https://scontent.fkhi21-1.fna.fbcdn.net/v/t39.30808-6/310814345_542724527852688_2144341401642080527_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeFrzVPHwLgcsa4No-wJwfKz9_tTuQ3WwJL3-1O5DdbAklvyWsBny5lLGH3Hq1M23APyWx8heFj0ihpyzjBTHDYZ&_nc_ohc=B1ZBlBwz4XYAX8V2Itf&_nc_ht=scontent.fkhi21-1.fna&oh=00_AfBh-POnNtbKrIWggQtPFD5lbovZJK0hT4Bt-qE4GNJ3qw&oe=64E95F54" />
                    <h4>Shan Masood</h4>
                </div>
            </div>
        </div>
    )
}

export default RightSidebar