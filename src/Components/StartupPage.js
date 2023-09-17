import React from 'react'
import { Link } from 'react-router-dom'

function StartupPage() {
    const isUserLoggedOut = sessionStorage.getItem('userLoggedOut');

    if (isUserLoggedOut === 'true') {
        sessionStorage.removeItem('userLoggedOut');
    }

    return (
        <div>
            <h1>Welcome to Facebook</h1>
            <Link to="/login">
                <button>Login</button>
            </Link>
            <Link to="/signup">
                <button>Signup</button>
            </Link>
        </div>
    )
}

export default StartupPage