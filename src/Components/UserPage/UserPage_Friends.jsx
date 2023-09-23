import "../../CSS/UserPage/UserPage_Friends.css"
import cover from "../../Imgs/Cover.jpg";
import React from 'react'

function UserPage_Friends() {
    return (
        <div className='userpage_Friends'>
            <div className="userpage_Friends_top">
                <h2>Friends</h2>
                <a href="#">See all friends</a>
            </div>
            <div className="userpage_Friends_bottom">
                <div className="grid-container">
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                    <div className="friend">
                        <img src={cover} alt="" />
                        <h5>Friend name</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPage_Friends