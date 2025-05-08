import { createContext, useContext, useState } from "react";

const MessageBoxContext = createContext();

export const MessageBoxProvider = ({ children }) => {
    const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
    const [selectedMessageUser, setSelectedMessageUser] = useState(null);

    return (
        <MessageBoxContext.Provider
            value={{
                isMessageBoxOpen,
                selectedMessageUser,
                setIsMessageBoxOpen,
                setSelectedMessageUser
            }}
        >
            {children}
        </MessageBoxContext.Provider>
    );
};

export const useMessageBox = () => {
    return useContext(MessageBoxContext);
};