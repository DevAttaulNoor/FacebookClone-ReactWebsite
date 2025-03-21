import { ReactIcons } from "@constants/ReactIcons"

export const ProfileAvatar = ({ imageStyleClass = '', iconStyleClass = '', userData }) => {
    return (
        <>
            {userData?.profilePhoto ? (
                <img
                    src={userData?.profilePhoto}
                    alt={`profile picture of ${userData.username}`}
                    className={`${imageStyleClass} object-contain border rounded-full border-customGray-100 bg-white`}
                />
            ) : (
                <span className={`${iconStyleClass}`}>
                    {ReactIcons.PROFILE_AVATAR}
                </span>
            )}
        </>
    )
}
