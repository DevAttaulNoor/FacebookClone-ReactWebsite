import { Link } from "react-router";
import { Routes } from "@constants/Routes";

const Login = () => {
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
                <form className="flex flex-col gap-3.5">
                    <input
                        type="email"
                        placeholder="Email address"
                        required
                        className="loginInputStyle"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="loginInputStyle"
                    />

                    <button className="rounded-md border border-slate-100 bg-customBlue-default px-4 py-2.5 text-xl font-semibold text-white outline-none">
                        Log in
                    </button>
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
