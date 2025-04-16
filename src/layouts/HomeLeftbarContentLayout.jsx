import { ReactIcons } from "@constants/ReactIcons"
import { ProfileAvatar } from "@components/universal/ProfileAvatar"

export const HomeLeftbarContentLayout = ({ title, children }) => {
    return (
        <>
            <div className="flex items-center justify-between border-b border-b-slate-300">
                <h4 className="font-medium text-[#65676B]">{title}</h4>

                <div className="flex items-center">
                    <span className="cursor-pointer rounded-3xl p-1.5 text-lg text-[#65676B] hover:bg-slate-100">
                        {ReactIcons.SEARCH_MAGNIFYINGGLASS}
                    </span>
                    <span className="cursor-pointer rounded-3xl p-1.5 text-lg text-[#65676B] hover:bg-slate-100">
                        {ReactIcons.OPTIONS_THREE_DOTS}
                    </span>
                </div>
            </div>

            {children}
        </>
    )
}
