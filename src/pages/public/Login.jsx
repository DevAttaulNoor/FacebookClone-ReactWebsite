import { useState } from "react";
import { Link } from "react-router";
import { Routes } from "@constants/Routes";
import { handleLoggingIn } from "@utils/AuthHandling";
import { InputField } from "@components/universal/inputs/InputField";

const Login = () => {
    const [formInput, setFormInput] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <div className="h-full w-full flex flex-col items-center justify-center gap-4 py-10 px-4 md:flex-row">
            <div className="flex flex-col items-center gap-2 md:items-start">
                <h1 className="text-5xl font-bold text-customBlue-default">facebook</h1>
                <p className="w-full text-center text-2xl text-slate-900 xs:w-[80%] sm:w-2/3 md:w-[70%] md:text-start lg:w-2/3">
                    Facebook helps you connect and share with the people in your
                    life.
                </p>
            </div>

            <div className="max-w-[380px] w-full flex flex-col p-4 gap-3.5 rounded-lg bg-white">
                <form
                    onSubmit={(e) => handleLoggingIn(e, formInput, setFormInput, setError, setLoading)}
                    className="flex flex-col gap-3.5"
                >
                    <InputField
                        inputData={{
                            type: 'email',
                            value: formInput.email,
                            placeholder: 'Email address',
                            onChange: (e) => setFormInput(prev => ({ ...prev, email: e.target.value })),
                            required: true
                        }}
                        inputStyle="launchpageInputStyle w-full p-4"
                    />

                    <InputField
                        inputData={{
                            type: 'password',
                            value: formInput.password,
                            placeholder: 'Password',
                            onChange: (e) => setFormInput(prev => ({ ...prev, password: e.target.value })),
                            required: true
                        }}
                        inputStyle="launchpageInputStyle w-full p-4"
                    />

                    {loading ? (
                        <button className="w-full rounded-md border border-slate-100 bg-customBlue-default px-4 py-2.5 text-xl font-semibold text-white outline-none">
                            <p className='w-7 h-7 mx-auto border-2 border-b-0 animate-spin rounded-full border-white'></p>
                        </button>
                    ) : (
                        <button className="w-full rounded-md border border-slate-100 bg-customBlue-default px-4 py-2.5 text-xl font-semibold text-white outline-none">
                            Log in
                        </button>
                    )}

                    {error && <p className="text-center text-sm text-red-500">{error}</p>}
                </form>

                <button className="text-sm text-customBlue-default outline-none">
                    Forgotten password?
                </button>

                <hr className="text-slate-300" />

                <Link
                    to={Routes.SIGNUP.path}
                    className="mx-auto w-fit rounded-md bg-[#42b72a] px-4 py-3 text-center text-lg font-bold text-white"
                >
                    {Routes.SIGNUP.title}
                </Link>
            </div>
        </div>
    );
};

export default Login;