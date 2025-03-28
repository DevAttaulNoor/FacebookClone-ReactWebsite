import { Navigate, Outlet } from "react-router";
import { Routes } from "@constants/Routes";
import { useAuthUser } from "@hooks/useAuthUser";
import { Loading } from "@pages/General/Loading";

export const PublicRoute = () => {
    const { isAuthenticated, loading } = useAuthUser();

    if (loading) {
        return <Loading />;
    }

    return !isAuthenticated ? <Outlet /> : <Navigate to={Routes.HOME.path} replace />;
};