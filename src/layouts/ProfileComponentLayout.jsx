import { Link } from "react-router"

export const ProfileComponentLayout = ({ children, path, title, noSeeAll = true }) => {
    return (
        <div className="w-full flex flex-col p-4 gap-2 rounded-lg shadow-customFull2 bg-white">
            <div className="flex items-center justify-between">
                <Link
                    to={path}
                    className="text-xl font-bold cursor-pointer hover:underline"
                >
                    {title}
                </Link>

                {noSeeAll && (
                    <Link
                        to={path}
                        className="text-customBlue-default p-2 rounded-md cursor-pointer hover:bg-customGray-default"
                    >
                        See all {title}
                    </Link>
                )}
            </div>

            {children}
        </div>
    )
}