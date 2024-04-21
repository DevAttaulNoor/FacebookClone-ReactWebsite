import '../../CSS/Authentication/Authentication.css'
import React from 'react'
import { useSelector } from 'react-redux';
import Login from './Login';
import Signup from './Signup';

function Authentication() {
    const authForm = useSelector((state) => state.data.authForm.authForm);

    return (
        <div className='authentication'>
            {authForm === 'login' ? (
                <>
                    <div className="authenticationTop">
                        <h1>facebook</h1>
                        <p>Facebook helps you connect and share with the people in your life.</p>
                    </div>

                    <div className='authenticationBottom'>
                        <Login />
                    </div>
                </>
            ) : (
                <>
                    <div className="authenticationTop">
                        <h1>facebook</h1>
                    </div>

                    <div className='authenticationBottom'>
                        <Signup />
                    </div>
                </>
            )}
        </div>
    )
}

export default Authentication