import { Link } from "react-router"
import { Routes } from "@constants/Routes"
import { timeAgo } from "@utils/TimeModule"
import { generatePath } from "@utils/PathResolver"

export const GroupList = ({ title, titleLink, groupsData }) => {
    return (
        <div className="flex flex-col pt-3 mt-4 gap-1 border-t">
            <div className="flex justify-between px-2">
                <h5 className="font-semibold">{title}</h5>

                {titleLink && (
                    <Link
                        to={titleLink}
                        className="text-sm font-light cursor-pointer text-customBlue-300 hover:underline"
                    >
                        see all
                    </Link>
                )}
            </div>

            {groupsData.map(data => (
                <Link
                    key={data.id}
                    to={generatePath({ path: Routes.GROUP.path }, { id: data.id })}
                    className="flex items-center p-2 gap-2.5 rounded-md cursor-pointer hover:bg-customGray-default"
                >
                    <img
                        src={data?.coverPhoto ? data?.coverPhoto : group_coverphoto}
                        alt={`cover photo of ${data?.name}`}
                        className="w-12 h-12 border rounded-lg object-cover"
                    />

                    <div>
                        <h5 className="text-sm font-medium">{data?.name}</h5>
                        <p className="text-xs text-customGray-200 cursor-pointer">{timeAgo(data?.timestamp)}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}
