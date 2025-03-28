import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

export const OuterContainer = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [location]);

    return (
        <main className="outerContainerStyle">
            {children ? children : <Outlet />}
        </main>
    );
};