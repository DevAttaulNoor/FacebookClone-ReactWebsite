import { ReactIcons } from "@constants/ReactIcons"

export const ProfileAvatar = ({ imageStyleClass = '', iconStyleClass = '', title, onClick, userData }) => {
    return (
        <>
            {userData?.profilePhoto ? (
                <img
                    title={title}
                    onClick={onClick}
                    src={userData?.profilePhoto}
                    alt={`profile picture of ${userData.username}`}
                    className={`${imageStyleClass} border rounded-full flex-shrink-0 object-contain cursor-pointer overflow-hidden border-customGray-100 bg-white`}
                />
            ) : (
                <span
                    title={title}
                    onClick={onClick}
                    className={`${iconStyleClass} cursor-pointer`}
                >
                    {ReactIcons.PROFILE_AVATAR}
                </span>
            )}
        </>
    )
}