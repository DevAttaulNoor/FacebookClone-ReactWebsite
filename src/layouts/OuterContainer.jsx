import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Routes } from "@constants/Routes";
import { useAuthUser } from "@hooks/useAuthUser";
import { Header } from "../components/universal/Header";
import { ReactIcons } from "@constants/ReactIcons";
import { MessageBox } from "@components/universal/message-related/MessageBox";

export const OuterContainer = ({ children }) => {
    const { user } = useAuthUser();
    const location = useLocation();
    const [isMessageBoxVisible, setIsMessageBoxVisisble] = useState(false);
    const isHeaderVisible = !user || (location.pathname === Routes.LOGIN.path) || (location.pathname === Routes.SIGNUP.path)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [location.pathname]);

    return (
        <main className="outerContainerStyle">
            {!isHeaderVisible && < Header />}
            {children ? children : <Outlet />}

            {user && (
                <>
                    <span
                        onClick={() => setIsMessageBoxVisisble(true)}
                        className="absolute bottom-6 right-10 text-2xl p-3.5 rounded-full shadow-customFull2 cursor-pointer bg-white hover:bg-customGray-default"
                    >
                        {ReactIcons.EDIT_PENCIL_BOX}
                    </span>

                    {isMessageBoxVisible && <MessageBox isClose={() => setIsMessageBoxVisisble(false)} />}
                </>
            )}
        </main>
    );
};