export const StoryContainerContent = ({ storyData }) => {
    return (
        <div className="w-[80%] flex flex-col gap-5 p-4 rounded-lg shadow-lg bg-white">
            <h5 className="text-sm font-medium">Preview</h5>

            <div className="h-full flex items-center justify-center p-4 rounded-lg bg-black">
                <div
                    id={`${storyData.id}`}
                    style={storyData.id === 'textStoryContent' ? { backgroundColor: storyData.background } : { backgroundImage: storyData.background }}
                    className={`${storyData.fontfamily} w-72 h-full text-xl font-semibold flex items-center justify-center py-10 px-8 rounded-2xl break-words bg-no-repeat bg-center bg-cover overflow-x-hidden overflow-y-auto text-white`}
                >
                    {storyData.inputValue}
                </div>
            </div>
        </div>
    )
}
