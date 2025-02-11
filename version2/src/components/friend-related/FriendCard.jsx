export const FriendCard = ({ friendData }) => {
    return (
        <div className='flex flex-col rounded-lg gap-1.5 shadow-customFull2 bg-white'>
            <img
                src={friendData.image}
                alt={`image of ${friendData.name}`}
                className="h-52 rounded-t-lg object-cover"
            />

            <h5 className="font-medium px-3">{friendData.name}</h5>

            <div className='flex flex-col p-3 gap-2'>
                <button className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer text-customBlue-default bg-customBlue-100 hover:bg-customGray-default">
                    Add friend
                </button>

                <button className="w-full text-sm font-semibold px-2.5 py-2 rounded cursor-pointer bg-customGray-100 hover:bg-customGray-default">
                    Remove
                </button>
            </div>
        </div>
    )
}