import { ReactIcons } from "@constants/ReactIcons"
import { DropdownLayout } from "@layouts/DropdownLayout"

export const BasicDropdown = ({ isOpen, isClose, dropdownContainerStyle = '', dropdownData = '', children }) => {
    return (
        <DropdownLayout
            isOpen={isOpen}
            isClose={isClose}
            dropdownContainerStyle={`${dropdownContainerStyle}`}
        >
            {dropdownData.title && (
                <div className='flex items-center justify-between'>
                    <h2 className="text-2xl font-semibold">{dropdownData.title}</h2>
                    <span className="text-xl p-2 rounded-full cursor-pointer text-customGray-200 hover:bg-customGray-default">{ReactIcons.OPTIONS_THREE_DOTS}</span>
                </div>
            )}

            {children}
        </DropdownLayout>
    )
}