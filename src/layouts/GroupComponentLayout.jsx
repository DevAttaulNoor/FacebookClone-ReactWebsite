export const GroupComponentLayout = ({ containerStyle = '', title, description, children }) => {
    return (
        <div className={`${containerStyle} flex flex-col py-3 px-4 gap-3 rounded-xl shadow-customFull2 bg-white`}>
            <h5 className="font-semibold">{title}</h5>
            {description && (
                <p className="text-sm ">{description}</p>
            )}
            <hr className="text-customGray-100" />

            {children}
        </div>
    )
}
