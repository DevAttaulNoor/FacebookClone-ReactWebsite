import { Link } from "react-router";
import { Routes } from "@constants/Routes";
import { SvgIcons } from "@constants/SvgIcons";

export const Error = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <span>{SvgIcons.ERROR()}</span>

            <h1 className="text-xl font-bold text-customGray-300">This content isn't available right now</h1>

            <p className="w-1/3 text-center leading-tight text-customGray-300">When this happens, it's usually because the owner only shared it with a small group of people, changed who can see it or it's been deleted.</p>

            <Link
                to={Routes.HOME.path}
                className="font-medium px-8 py-2 mt-3 rounded-md cursor-pointer text-white bg-customBlue-default"
            >
                Go to News Feed
            </Link>

            <Link
                to={Routes.HOME.path}
                className="font-medium mt-1 cursor-pointer text-customBlue-default hover:underline"
            >
                Go back
            </Link>
        </div>
    )
}