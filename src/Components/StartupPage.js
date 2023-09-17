import React from 'react'
import { Link } from 'react-router-dom'

function StartupPage() {
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