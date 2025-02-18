import { ReactIcons } from "@constants/ReactIcons";

export const ModalLayout = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center z-30 bg-customGray-100 bg-opacity-50">
            <div className="bg-white rounded-xl max-w-[45%] w-full">
                <span
                    onClick={onClose}
                    className="cursor-pointer"
                >
                    {ReactIcons.CLOSE}
                </span>

                {children}
            </div>
        </div>
    );
};