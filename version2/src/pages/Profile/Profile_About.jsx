import { ReactIcons } from "@constants/ReactIcons";

const leftOptionData = [
    {
        id: 0,
        title: 'Overview',
    },
    {
        id: 1,
        title: 'Work and education',
    },
    {
        id: 2,
        title: 'Places lived',
    },
    {
        id: 3,
        title: 'Contact and basic info',
    },
    {
        id: 4,
        title: 'Family and relationships',
    },
    {
        id: 5,
        title: 'Details About you',
    },
    {
        id: 6,
        title: 'Life events',
    },
]

const rightOptionData = [
    {
        id: 0,
        title: 'Add a workplace',
    },
    {
        id: 1,
        title: 'Add secondary school',
    },
    {
        id: 2,
        title: 'Add university',
    },
    {
        id: 3,
        title: 'Add current city',
    },
    {
        id: 4,
        title: 'Add home town',
    },
    {
        id: 5,
        title: 'Add a relationship status',
    },
]

export const Profile_About = () => {
    return (
        <div className="w-full flex rounded-lg shadow-customFull2 bg-white">
            <div className="flex-[0.25] px-1.5 py-3 border-r border-r-customGray-default">
                <h3 className="text-lg font-bold cursor-pointer hover:underline">About</h3>

                {leftOptionData.map((data) => (
                    <p key={data.id} className="text-sm font-medium p-2 mb-1 rounded-md text-customGray-300 hover:text-customGray-100 last:mb-0">{data.title}</p>
                ))}
            </div>

            <div className="flex-[0.75] p-4">
                {rightOptionData.map((data) => (
                    <div key={data.id} className='flex items-center my-4 cursor-pointer hover:underline hover:text-customGray-100'>
                        <span className="text-lg text-customGray-200 p-0.5 rounded-full border border-customGray-200 mr-2">{ReactIcons.ADD_PLUS}</span>
                        <p className="text-sm font-medium p-1.5 text-customGray-200">{data.title}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}