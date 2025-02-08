import { Link } from "react-router"
import { Routes } from "@constants/Routes"

const Login = () => {
    return (
        <div className='w-full h-full flex items-center justify-center py-10'>
            <div className="flex flex-col gap-2">
                <h1 className="text-5xl font-bold text-[#1877f2]">facebook</h1>
                <p className="w-2/3 text-2xl text-slate-900">Facebook helps you connect and share with the people in your life.</p>
            </div>

            <div className="flex flex-col p-4 gap-3.5 rounded-lg bg-white">
                <form className='flex flex-col gap-3.5'>
                    <input
                        type="email"
                        placeholder="Email address"
                        required
                        className="w-92 p-4 rounded-md outline-none border border-slate-300"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="w-92 p-4 rounded-md outline-none border border-slate-300"
                    />

                    <button className="text-xl font-semibold px-4 py-2.5 border border-slate-100 rounded-md outline-none text-white bg-[#1877f2]">Log in</button>
                </form>

                <button className="text-sm outline-none text-[#1877f2]">Forgotten password?</button>
                <hr className="text-slate-300" />
                <Link
                    to={Routes.SIGNUP.path}
                    className="w-fit text-lg font-bold px-4 py-3 mx-auto rounded-md text-white bg-[#42b72a]"
                >
                    {Routes.SIGNUP.title}
                </Link>
            </div>
        </div>
    )
}

export default Login