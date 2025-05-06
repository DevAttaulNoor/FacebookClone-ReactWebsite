import { ReactIcons } from "@constants/ReactIcons"

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

const Profile_About = () => {
    return (
        <div className="w-full flex rounded-lg shadow-customFull2 bg-white">
            <div className="flex-[0.35] p-2 border-r border-r-customGray-default sm:flex-[0.25] sm:p-2.5">
                <h3 className="w-fit text-lg font-bold mb-1 cursor-pointer hover:underline xs:text-xl">About</h3>

                <div className="flex flex-col justify-between gap-3">
                    {leftOptionData.map((data) => (
                        <p
                            key={data.id}
                            className="w-fit text-[10px] font-medium rounded-md cursor-pointer text-customGray-300 hover:text-slate-400 xs:text-xs sm:text-sm"
                        >
                            {data.title}
                        </p>
                    ))}
                </div>
            </div>

            <div className="flex-[0.65] flex flex-col justify-between p-2 gap-2 xs:p-2.5 xs:gap-2 sm:flex-[0.75] sm:gap-2.5 md:gap-3 lg:p-3.5 lg:gap-3.5 xl:p-4 xl:gap-4">
                {rightOptionData.map((data) => (
                    <div key={data.id} className='w-fit flex items-center gap-2 cursor-pointer hover:underline hover:text-customGray-100'>
                        <span className="text-xs text-customGray-200 p-1 rounded-full border border-customGray-200 sm:text-lg">{ReactIcons.ADD_PLUS}</span>
                        <p className="text-xs font-medium text-customGray-200 sm:text-sm">{data.title}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Profile_About