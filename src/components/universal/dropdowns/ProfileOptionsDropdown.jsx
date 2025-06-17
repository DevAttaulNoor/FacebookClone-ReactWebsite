import { Routes } from "@constants/Routes";
import { Link, useNavigate } from "react-router";
import { ProfileAvatar } from "../ProfileAvatar";
import { TermsAndLinks } from "../TermsAndLinks";
import { ReactIcons } from "@constants/ReactIcons";
import { handleLoggingOut } from "@utils/AuthHandling";
import { DropdownLayout } from "@layouts/DropdownLayout";

export const ProfileOptionsDropdown = ({ dropdownStateData, userData }) => {
    const navigate = useNavigate();

    const profileOptions = [
        {
            id: 1,
            text: 'Switch Display',
            icon: ReactIcons.MOON,
        },
        {
            id: 2,
            text: 'Contact Dev',
            icon: ReactIcons.CODE,
            onClick: () => navigate(Routes.CONTACT.path)
        },
        {
            id: 3,
            text: 'Log out',
            icon: ReactIcons.SETTING,
            onClick: () => handleLoggingOut()
        }
    ];

    return (
        <DropdownLayout
            isOpen={dropdownStateData.dropdownOpen.profileDropdown}
            isClose={() => dropdownStateData.setDropdownOpen(prev => ({ ...prev, profileDropdown: false }))}
            dropdownContainerStyle="dropdownContainerStyle1 gap-1"
        >
            <Link
                to={`/profile/${userData?.uid}`}
                onClick={() => dropdownStateData.setDropdownOpen(prev => ({ ...prev, profileDropdown: false }))}
                className='flex items-center p-1.5 gap-2.5 rounded-lg cursor-pointer hover:bg-customGray-default'
            >
                <ProfileAvatar
                    userData={userData}
                    imageStyleClass="w-9 h-9"
                    iconStyleClass="flex items-center justify-center text-xl p-2 rounded-full bg-customGray-100"
                />
                <p className="text-sm font-medium">{userData?.username}</p>
            </Link>

            {profileOptions.map((data) => (
                <div
                    key={data.id}
                    onClick={() => {
                        data?.onClick?.();
                        dropdownStateData.setDropdownOpen(prev => ({ ...prev, profileDropdown: false }));
                    }}
                    className='flex items-center p-1.5 gap-2.5 rounded-lg cursor-pointer hover:bg-customGray-default'
                >
                    <span className="text-xl p-2 rounded-full bg-customGray-100">{data.icon}</span>
                    <p className="text-sm font-medium">{data.text}</p>
                </div>
            ))}

            <TermsAndLinks containerStyle="px-1.5 mt-1.5" />
        </DropdownLayout>
    );
};
