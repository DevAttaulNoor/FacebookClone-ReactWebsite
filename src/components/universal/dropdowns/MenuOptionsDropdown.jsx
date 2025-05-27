import { Link } from "react-router"
import { Routes } from "@constants/Routes";
import { SvgIcons } from "@constants/SvgIcons";
import { SearchBar } from "../searchBar/SearchBar"
import { ReactIcons } from "@constants/ReactIcons";
import { DropdownLayout } from "@layouts/DropdownLayout"

const MenuCreateOptions = [
    {
        id: 1,
        title: "Post",
        icon: ReactIcons.EDIT_PENCIL_BOX,
    },
    {
        id: 2,
        title: "Story",
        icon: SvgIcons.STORY({ styleClass: 'w-[22px] h-[20px]' }),
        link: Routes.STORY_CREATE.path,
    },
    {
        id: 3,
        title: "Reel",
        icon: SvgIcons.REEL({ styleClass: 'w-[22px] h-[20px]' }),
        link: Routes.REEL_CREATE.path,
    },
    {
        id: 4,
        title: "Group",
        icon: ReactIcons.GROUP,
        link: Routes.GROUP_CREATE.path,
    },
];

const MenuOptions = [
    {
        id: 1,
        title: "Friends",
        description: 'Search for friends or people you may know.',
        icon: ReactIcons.FRIEND,
        link: Routes.FRIEND.path
    },
    {
        id: 2,
        title: "Groups",
        description: 'Connect with people who share your interests.',
        icon: ReactIcons.GROUP,
        link: Routes.GROUP_FEED.path
    },
    {
        id: 3,
        title: "Feeds",
        description: 'See the most recent posts from your friends, groups and more.',
        icon: SvgIcons.FEED({ styleClass: 'w-[29px] h-[26px]' }),
        link: Routes.FEED.path
    },
    {
        id: 4,
        title: "Videos",
        description: 'A video destination personalized to your interests and connection.',
        icon: ReactIcons.VIDEO,
        link: Routes.VIDEO.path
    },
    {
        id: 5,
        title: "Saved",
        description: 'Find posts, photos and videos that you have saved for later.',
        icon: SvgIcons.SAVED({ styleClass: 'w-[29px] h-[26px]' }),
        link: Routes.SAVED.path
    },
];

export const MenuOptionsDropdown = ({ dropdownStateData, searchInputStateData }) => {
    return (
        <DropdownLayout
            isOpen={dropdownStateData.dropdownOpen.menuDropdown}
            isClose={() => dropdownStateData.setDropdownOpen(prev => ({ ...prev, menuDropdown: false }))}
            dropdownContainerStyle="dropdownContainerStyle1 !w-80 p-3 xs:!w-96 sm:!w-[420px]"
        >
            <h2 className="text-2xl font-semibold">Menu</h2>

            <div className="flex gap-3 sm:gap-4">
                <div className="flex-[0.7] flex flex-col p-2 rounded-lg shadow-customFull bg-white">
                    <div className="py-2">
                        <SearchBar
                            inputStyle={"w-full bg-transparent py-2.5 text-sm"}
                            inputData={{
                                type: 'text',
                                value: searchInputStateData.inputValue.menuSearch,
                                placeholder: 'Search menu',
                                onChange: (e) => searchInputStateData.setInputValue(prev => ({ ...prev, menuSearch: e.target.value }))
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        {MenuOptions.map(data => (
                            <Link
                                key={data.id}
                                to={data.link}
                                onClick={() => dropdownStateData.setDropdownOpen(prev => ({ ...prev, menuDropdown: false }))}
                                className='flex items-center p-1.5 gap-2 rounded-lg cursor-pointer hover:bg-customGray-default md:gap-3'
                            >
                                <span className="text-3xl">{data.icon}</span>

                                <div className="flex flex-col gap-0.5">
                                    <h5 className="text-xs font-medium sm:text-sm">{data.title}</h5>
                                    <p className="text-[10px] text-customGray-200 sm:text-xs">{data.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="h-fit flex-[0.3] flex flex-col p-2 rounded-lg shadow-customFull bg-white">
                    <h2 className="text-lg font-semibold mb-2">Create</h2>

                    <div className="flex flex-col gap-1">
                        {MenuCreateOptions.map((data) => (
                            <Link
                                key={data.id}
                                to={data?.link}
                                onClick={() => dropdownStateData.setDropdownOpen(prev => ({ ...prev, menuDropdown: false }))}
                                className='flex items-center px-1.5 py-2 gap-2 rounded-lg cursor-pointer hover:bg-customGray-default'
                            >
                                <span className="flex items-center justify-center p-1.5 text-2xl rounded-full cursor-pointer bg-customGray-100">
                                    {data.icon}
                                </span>

                                <h5 className="text-xs font-medium sm:text-sm">{data.title}</h5>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </DropdownLayout>
    )
}