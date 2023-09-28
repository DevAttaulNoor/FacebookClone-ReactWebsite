import '../../CSS/HomePage/HomePage_StoryReels_Main.css'
import React from 'react'
import fblogo from '../../Imgs/fblogo.png'
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import TitleIcon from '@mui/icons-material/Title';
import { useStateValue } from '../BackendRelated/StateProvider';
import { Avatar } from '@mui/material';

function HomePage_StoryReels_Main() {
    const [{ user }] = useStateValue()

    return (
        <div className='homepage_storyreels_Main'>
            <div className="homepage_storyreels_Main_Sidebar">
                <div className='homepage_storyreels_Main_SidebarTop'>
                    <div className="homepage_storyreels_Main_SidebarTop_Top">
                        <p>Your story</p>
                        <SettingsIcon />
                    </div>
                    <div className="homepage_storyreels_Main_SidebarTop_Bottom">
                        <Avatar src={user.photoURL} />
                        <p>{user.displayName}</p>
                    </div>

                    <hr />
                </div>
            </div>

            <div className="homepage_storyreels_Main_Body">
                <div className="homepage_storyreels_Main_BodyCard Photo">
                    <img src="https://static.xx.fbcdn.net/rsrc.php/v3/y7/r/Ivw7nhRtXyo.png?_nc_eui2=AeFIN4dua_6GwPFkOshGHR00PL4YoeGsw5I8vhih4azDkrvKepSUCMn7LYfrqKUcUJimL4hKbOZB6qAi70AVDE9j" alt="" />
                    <p>Create a Photo Story</p>
                </div>

                <div className="homepage_storyreels_Main_BodyCard Text">
                    <TitleIcon/>
                    <p>Create a Text Story</p>
                </div>
            </div>
        </div>
    )
}

export default HomePage_StoryReels_Main