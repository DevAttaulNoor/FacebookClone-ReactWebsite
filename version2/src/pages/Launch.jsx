export const Launch = () => {
    return (
        <div className='authentication'>
            <div className='authenticationInner'>
                <div className="authenticationInnerLeft">
                    <h1>facebook</h1>
                    <p>Facebook helps you connect and share with the people in your life.</p>
                </div>

                {authForm === 'login' ? (
                    <div className='authenticationInnerRight'>
                        <Login />
                    </div>
                ) : (
                    <div className='authenticationInnerRight'>
                        <Signup />
                    </div>
                )}
            </div>
        </div>
    )
}