export const LeftbarLayout = ({ title, icon, children }) => {
    return (
        <div className='leftbarStyle py-3 px-2 z-[5]'>
            {(title || icon) && (
                <div className="flex items-center justify-between px-1 mb-3 sm:px-2">
                    <h5 className="text-2xl font-extrabold">{title}</h5>

                    {icon && (
                        <span className="text-2xl p-2 rounded-full bg-customGray-default cursor-pointer hover:bg-customGray-100">
                            {icon}
                        </span>
                    )}
                </div>
            )}

            {children}
        </div>
    )
}