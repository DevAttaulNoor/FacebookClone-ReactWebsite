import { Outlet, useLocation } from "react-router";
import { Routes } from "@constants/Routes";
import { Header } from "../components/universal/Header";
import { useAuthUser } from "@hooks/useAuthUser";

export const OuterContainer = ({ children }) => {
    const user = useAuthUser();
    const location = useLocation();
    const headerToShow = !user || (location.pathname === Routes.LOGIN.path) || (location.pathname === Routes.SIGNUP.path)

    return (
        <main className="outerContainerStyle">
            {!headerToShow && < Header />}
            {children ? children : <Outlet />}
        </main>
    );
};