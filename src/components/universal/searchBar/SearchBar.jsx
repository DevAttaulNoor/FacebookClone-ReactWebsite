import { ReactIcons } from "@constants/ReactIcons"
import { InputField } from "../inputs/InputField"

export const SearchBar = ({ containerStyle = '', containerOnClick, inputStyle, inputData }) => {
    return (
        <div onClick={containerOnClick} className={`${containerStyle} w-full flex items-center px-3 gap-1.5 rounded-3xl bg-customGray-default`}>
            <span className="text-customGray-200">
                {ReactIcons.SEARCH_MAGNIFYINGGLASS}
            </span>

            <InputField
                inputStyle={inputStyle}
                inputData={inputData}
            />
        </div>
    )
}