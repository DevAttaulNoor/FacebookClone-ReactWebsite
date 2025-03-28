import { useState } from "react";
import { Navigate, Outlet } from "react-router";
import { Routes } from "@constants/Routes";
import { useAuthUser } from "@hooks/useAuthUser";
import { Loading } from "@pages/General/Loading";
import { ReactIcons } from "@constants/ReactIcons";
import { Header } from "@components/universal/Header";
import { MessageBox } from "@components/universal/message-related/MessageBox";

export const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuthUser();
    const [isMessageBoxVisible, setIsMessageBoxVisisble] = useState(false);

    if (loading) {
        return <Loading />;
    }

    return isAuthenticated ? (
        <>
            <Header />
            <Outlet />

            <>
                <span
                    onClick={() => setIsMessageBoxVisisble(true)}
                    className="absolute bottom-4 right-8 text-2xl p-3.5 rounded-full shadow-customFull2 cursor-pointer bg-white hover:bg-customGray-default"
                >
                    {ReactIcons.EDIT_PENCIL_BOX}
                </span>

                {isMessageBoxVisible && <MessageBox isClose={() => setIsMessageBoxVisisble(false)} />}
            </>
        </>
    ) : (
        <Navigate to={Routes.LOGIN.path} replace />
    );
};