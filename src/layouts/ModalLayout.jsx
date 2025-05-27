export const ModalLayout = ({ isOpen, children, containerStyle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 bottom-0 right-0 left-0 flex items-center justify-center z-30 bg-opacity-50 bg-customGray-100">
            <div className={`${containerStyle} max-w-[85%] w-full flex flex-col rounded-xl bg-white xs:max-w-[70%] sm:max-w-[60%] md:max-w-[50%] lg:max-w-[40%] xl:max-w-[35%] 2xl:max-w-[30%]`}>
                {children}
            </div>
        </div>
    );
};