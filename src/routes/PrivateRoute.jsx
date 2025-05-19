import { Navigate, Outlet } from "react-router-dom";
import { Routes } from "@constants/Routes";
import { useAuth } from "@contexts/AuthContext";
import { Loading } from "@pages/general/Loading";
import { ReactIcons } from "@constants/ReactIcons";
import { Header } from "@components/universal/Header";
import { useMessageBox } from "@contexts/MessageBoxContext";
import { MessageBox } from "@components/universal/message-related/MessageBox";

export const PrivateRoute = () => {
    const { user, loading } = useAuth();
    const { isMessageBoxOpen, setIsMessageBoxOpen } = useMessageBox();

    if (loading || user === undefined) {
        return <Loading />;
    }

    return user ? (
        <>
            <Header />
            <Outlet />

            <span
                onClick={() => setIsMessageBoxOpen(true)}
                className="absolute bottom-3 right-7 text-2xl p-3 rounded-full shadow-customFull2 cursor-pointer bg-white hover:bg-customGray-default lg:bottom-4 lg:right-8 lg:p-3.5"
            >
                {ReactIcons.EDIT_PENCIL_BOX}
            </span>

            {isMessageBoxOpen && (
                <MessageBox />
            )}
        </>
    ) : (
        <Navigate to={Routes.LOGIN.path} replace />
    );
};