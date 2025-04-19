import { Link } from "react-router"

export const BasicButton = ({ btnStyleClass = '', btnData }) => {
    return (
        <>
            {btnData.link ? (
                <Link
                    to={btnData.link}
                    className={`${btnStyleClass} w-full flex items-center justify-center px-2.5 py-3 gap-1.5 rounded-md`}
                >
                    {btnData.icon && (
                        <span className={`${btnData.iconStyleClass ? btnData.iconStyleClass : ''}`}>{btnData.icon}</span>
                    )}

                    <p className={`${btnData.textStyleClass ? btnData.textStyleClass : 'text-sm'} font-semibold leading-none whitespace-nowrap`}>{btnData.text}</p>
                </Link>
            ) : (
                <button
                    onClick={btnData.onClick}
                    className={`${btnStyleClass} w-full flex items-center justify-center px-2.5 py-3 gap-1.5 rounded-md`}
                >
                    {btnData.icon && (
                        <span className={`${btnData.iconStyleClass ? btnData.iconStyleClass : ''}`}>{btnData.icon}</span>
                    )}

                    <p className={`${btnData.textStyleClass ? btnData.textStyleClass : 'text-sm'} font-semibold leading-none whitespace-nowrap`}>{btnData.text}</p>
                </button>
            )}
        </>
    )
}