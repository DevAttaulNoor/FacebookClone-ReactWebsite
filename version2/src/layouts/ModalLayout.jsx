export const ModalLayout = ({ isOpen, children, containerStyle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center z-30 bg-customGray-100 bg-opacity-50">
            <div className={`${containerStyle} max-w-[35%] w-full flex flex-col rounded-xl bg-white`}>
                {children}
            </div>
        </div>
    );
};