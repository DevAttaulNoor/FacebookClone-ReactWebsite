import '../../CSS/Authentication/Authentication.css'
import React from 'react'
import { useSelector } from 'react-redux';
import Login from './Login';
import Signup from './Signup';

function Authentication() {
    const authForm = useSelector((state) => state.data.authForm.authForm);

    return (
        <div className='authentication'>
            <div className='authenticationInner'>
                <div className="authenticationLeft">
                    <h1>facebook</h1>
                    <p>Facebook helps you connect and share with the people in your life.</p>
                </div>

                {authForm === 'login' ? (
                    <div className='authenticationRight'>
                        <Login />
                    </div>
                ) : (
                    <div className='authenticationRight'>
                        <Signup />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Authentication