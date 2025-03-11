import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Routes } from "@constants/Routes";
import { useAuthUser } from "@hooks/useAuthUser";
import { Header } from "../components/universal/Header";

export const OuterContainer = ({ children }) => {
    const { user } = useAuthUser();
    const location = useLocation();
    const headerToShow = !user || (location.pathname === Routes.LOGIN.path) || (location.pathname === Routes.SIGNUP.path)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [location.pathname]);

    return (
        <main className="outerContainerStyle">
            {!headerToShow && < Header />}
            {children ? children : <Outlet />}
        </main>
    );
};