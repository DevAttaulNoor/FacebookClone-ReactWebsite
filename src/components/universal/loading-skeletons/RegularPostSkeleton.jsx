export const RegularPostSkeleton = ({ postContainerStyle = '', usedInGroupPosting = false }) => {
    return (
        <div className={`${postContainerStyle} flex flex-col gap-3 rounded-xl shadow-customFull2 bg-white`}>
            <div className={`${usedInGroupPosting ? 'gap-3.5' : 'gap-2.5'} flex items-center p-4 pb-0`}>
                {usedInGroupPosting ? (
                    <div className="relative">
                        <div className="w-[42px] h-[42px] rounded-lg bg-customGray-100 animate-pulse" />

                        <div className="absolute -bottom-2 -right-2">
                            <div className="w-[28px] h-[28px] rounded-full bg-customGray-100 animate-pulse" />
                        </div>
                    </div>
                ) : (
                    <span className="w-[42px] h-[42px] rounded-full bg-customGray-100 animate-pulse" />
                )}

                <div className="flex flex-col gap-1">
                    <span className="w-16 h-3 bg-customGray-100 animate-pulse" />
                    <span className="w-8 h-3 bg-customGray-100 animate-pulse" />
                </div>
            </div>

            <div className="flex flex-col px-4 gap-3">
                <div className="flex flex-col gap-1.5">
                    <span className="w-full h-3 bg-customGray-100 animate-pulse" />
                    <span className="w-2/3 h-3 bg-customGray-100 animate-pulse" />
                </div>

                <span className="w-full h-[400px] bg-customGray-100 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 mx-4 py-4 gap-1.5 border-t border-t-slate-400">
                <span className="w-8 h-3 mx-auto bg-customGray-100 animate-pulse" />
                <span className="w-8 h-3 mx-auto bg-customGray-100 animate-pulse" />
            </div>
        </div>
    )
}