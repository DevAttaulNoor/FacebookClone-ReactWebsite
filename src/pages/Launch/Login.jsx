import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@services/firebase";
import { Routes } from "@constants/Routes";
import { InputField } from "@components/universal/inputs/InputField";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate(Routes.HOME.path)
            setEmail('');
            setError('');
            setPassword('');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex h-full w-full items-center justify-center py-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-bold text-customBlue-default">facebook</h1>
                <p className="w-2/3 text-2xl text-slate-900">
                    Facebook helps you connect and share with the people in your
                    life.
                </p>
            </div>

            <div className="flex flex-col gap-3.5 rounded-lg bg-white p-4">
                <form
                    onSubmit={handleLogin}
                    className="flex flex-col gap-3.5"
                >
                    <InputField
                        inputData={{
                            type: 'email',
                            value: email,
                            placeholder: 'Email address',
                            onChange: (e) => setEmail(e.target.value),
                            required: true
                        }}
                        inputStyle="w-96 p-4"
                    />

                    <InputField
                        inputData={{
                            type: 'password',
                            value: password,
                            placeholder: 'Password',
                            onChange: (e) => setPassword(e.target.value),
                            required: true
                        }}
                        inputStyle="w-96 p-4"
                    />

                    <button className="rounded-md border border-slate-100 bg-customBlue-default px-4 py-2.5 text-xl font-semibold text-white outline-none">
                        Log in
                    </button>

                    {error && <p className="text-center text-sm text-red-500">{error}</p>}
                </form>

                <button className="text-sm text-customBlue-default outline-none">
                    Forgotten password?
                </button>
                <hr className="text-slate-300" />
                <Link
                    to={Routes.SIGNUP.path}
                    className="mx-auto w-fit rounded-md bg-[#42b72a] px-4 py-3 text-lg font-bold text-white"
                >
                    {Routes.SIGNUP.title}
                </Link>
            </div>
        </div>
    );
};

export default Login;
