import { Link } from "react-router"

export const BasicButton = ({ btnStyleClass = '', btnData }) => {
    return (
        <>
            {btnData.link ? (
                <Link
                    to={btnData.link}
                    className={`${btnStyleClass} w-full flex items-center justify-center p-1.5 gap-1.5 rounded-md md:px-1.5 md:py-2 lg:px-2 lg:py-2.5 xl:px-2.5 xl:py-3`}
                >
                    {btnData.icon && (
                        <span className={`${btnData.iconStyleClass ? btnData.iconStyleClass : ''}`}>{btnData.icon}</span>
                    )}

                    <p className={`${btnData.textStyleClass ? btnData.textStyleClass : 'text-xs md:text-sm'} font-semibold leading-none whitespace-nowrap`}>{btnData.text}</p>
                </Link>
            ) : (
                <button
                    onClick={btnData.onClick}
                    className={`${btnStyleClass} w-full flex items-center justify-center p-1.5 gap-1.5 rounded-md md:px-1.5 md:py-2 lg:px-2 lg:py-2.5 xl:px-2.5 xl:py-3`}
                >
                    {btnData.icon && (
                        <span className={`${btnData.iconStyleClass ? btnData.iconStyleClass : ''}`}>{btnData.icon}</span>
                    )}

                    <p className={`${btnData.textStyleClass ? btnData.textStyleClass : 'text-xs md:text-sm'} font-semibold leading-none whitespace-nowrap`}>{btnData.text}</p>
                </button>
            )}
        </>
    )
}