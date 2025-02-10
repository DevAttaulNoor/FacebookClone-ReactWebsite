import { Link } from "react-router";
import { Routes } from "@constants/Routes";

const genderOptions = [
    {
        id: 1,
        title: 'Male'
    },
    {
        id: 2,
        title: 'Female'
    },
    {
        id: 3,
        title: 'Custom'
    },
]

const Signup = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => new Date(2000, i).toLocaleString('en', { month: 'short' }));
    const years = Array.from({ length: 100 }, (_, i) => new Date().getUTCFullYear() - i);

    return (
        <div className="flex h-full w-full flex-col items-center py-10 gap-10">
            <h1 className="text-7xl font-bold text-customBlue-default">facebook</h1>

            <div className="flex flex-col rounded-lg bg-white shadow-customFull">
                <div className="flex flex-col items-center justify-center px-4 py-2.5">
                    <h1 className="text-center text-2xl font-bold">
                        Create a new account
                    </h1>
                    <p className="font-light text-slate-700">
                        It's quick and easy.
                    </p>
                </div>

                <hr className="text-slate-500" />

                <div className="flex flex-col items-center gap-3.5 p-4">
                    <form className="flex flex-col gap-3.5">
                        <div className="w-96 flex items-center gap-2.5">
                            <input
                                type="text"
                                placeholder="First name"
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />

                            <input
                                type="text"
                                placeholder="Last name"
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2"
                            />
                        </div>

                        <input
                            type="email"
                            placeholder="Email address"
                            required
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                        />

                        <input
                            type="password"
                            placeholder="New password"
                            required
                            className="w-full rounded-md border border-slate-300 px-3 py-2"
                        />

                        <div className="flex flex-col gap-2">
                            <h5 className="text-xs text-customGray-200">Date of birth</h5>

                            <div className="grid grid-cols-3 gap-2.5">
                                <select className="w-full px-1 py-2 outline-none rounded-md border border-slate-300 cursor-pointer">
                                    {days.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>

                                <select className="w-full px-1 py-2 outline-none rounded-md border border-slate-300 cursor-pointer">
                                    {months.map((monthName) => (
                                        <option key={monthName} value={monthName}>
                                            {monthName}
                                        </option>
                                    ))}
                                </select>

                                <select className="w-full px-1 py-2 outline-none rounded-md border border-slate-300 cursor-pointer">
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h5 className="text-xs text-customGray-200">Gender</h5>

                            <div className="grid grid-cols-3 gap-2.5">
                                {genderOptions.map((data) => (
                                    <div key={data.id} className='w-full flex items-center justify-between p-2 rounded-md border border-slate-300 cursor-pointer'>
                                        <p>{data.title}</p>

                                        <input type="radio" name={data.title} id="" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-96">
                            <p className="mb-4 text-xs text-customGray-200">
                                People who use our service may have uploaded
                                your contact information to Facebook.{" "}
                                <span className="cursor-pointer text-customBlue-200 hover:underline">
                                    Learn more
                                </span>
                                .
                            </p>
                            <p className="text-xs text-customGray-200">
                                By clicking Sign Up, you agree to our{" "}
                                <span className="cursor-pointer text-customBlue-200 hover:underline">
                                    Terms
                                </span>
                                ,{" "}
                                <span className="cursor-pointer text-customBlue-200 hover:underline">
                                    Privacy Policy
                                </span>{" "}
                                and{" "}
                                <span className="cursor-pointer text-customBlue-200 hover:underline">
                                    Cookies Policy
                                </span>
                                . You may receive SMS notifications from us and
                                can opt out at any time.
                            </p>
                        </div>

                        <button className="mx-auto w-fit rounded-md bg-[#42b72a] px-16 py-2 text-lg font-bold text-white">
                            {"Sign Up"}
                        </button>
                    </form>

                    <Link
                        to={Routes.LOGIN.path}
                        className="text-lg text-customBlue-default"
                    >
                        Already have an account?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;