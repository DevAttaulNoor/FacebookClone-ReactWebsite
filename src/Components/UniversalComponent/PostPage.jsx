import "../../CSS/UniversalComponent/PostPage.css"
import React from 'react'
import { useLocation } from 'react-router-dom';

function PostPage() {
    const location = useLocation();
    const postid = location.state && location.state.postid;

    return (
        <div className="postPage">
            <h4>{postid}</h4>
        </div>
    )
}

export default PostPage