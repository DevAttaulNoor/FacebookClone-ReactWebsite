import { Link } from "react-router"

export const GroupComponentLayout = ({ containerStyle = '', titleData, description, children }) => {
    return (
        <div className={`${containerStyle} flex flex-col py-3 px-4 gap-3 rounded-xl shadow-customFull2 bg-white`}>
            <Link
                to={titleData?.path}
                className="w-fit font-semibold hover:underline"
            >
                {titleData?.text}
            </Link>

            {description && (
                <p className="text-sm">{description}</p>
            )}

            <hr className="text-customGray-100" />

            {children}
        </div>
    )
}
