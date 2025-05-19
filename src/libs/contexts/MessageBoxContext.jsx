import { createContext, useContext, useState } from "react";

const MessageBoxContext = createContext();

export const MessageBoxProvider = ({ children }) => {
    const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);

    return (
        <MessageBoxContext.Provider
            value={{
                isMessageBoxOpen,
                setIsMessageBoxOpen,
            }}
        >
            {children}
        </MessageBoxContext.Provider>
    );
};

export const useMessageBox = () => {
    return useContext(MessageBoxContext);
};