import { Navigate, Outlet } from "react-router";
import { Routes } from "@constants/Routes";
import { useAuth } from "@contexts/AuthContext";
import { Loading } from "@pages/general/Loading";

export const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    return !user ? <Outlet /> : <Navigate to={Routes.HOME.path} replace />;
};