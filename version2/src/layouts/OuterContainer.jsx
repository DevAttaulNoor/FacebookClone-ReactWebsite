import { Outlet } from "react-router";
import { Header } from "../components/universal/Header";

export const OuterContainer = ({ children }) => {
    return (
        <main className="outerContainerStyle">
            <Header />
            {children ? children : <Outlet />}
        </main>
    );
};