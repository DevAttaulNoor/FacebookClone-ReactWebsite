import {
    createBrowserRouter,
    RouterProvider,
    useRouteError,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import { Routes } from "./constants/Routes";
import { Error } from "./pages/General/Error";
import { Loading } from "./pages/General/Loading";
import { OuterContainer } from "./layouts/OuterContainer";

const Launch = lazy(() => import("./pages/Launch"));
const Home = lazy(() => import("./pages/Home"));
const Friend = lazy(() => import("./pages/Friend"));
const Group = lazy(() => import("./pages/Group"));
const Saved = lazy(() => import("./pages/Saved"));
const Video = lazy(() => import("./pages/Video"));
const Bookmark = lazy(() => import("./pages/Bookmark"));
const User = lazy(() => import("./pages/User"));
const Reel = lazy(() => import("./pages/Reel"));
const Profile = lazy(() => import("./pages/Profile"));
const Post = lazy(() => import("./pages/Post"));

const ErrorBoundary = () => {
    const errorData = useRouteError();

    return (
        <OuterContainer>
            <Error errorData={errorData} />
        </OuterContainer>
    );
};

const routes = createBrowserRouter([
    {
        element: <OuterContainer />,
        errorElement: <ErrorBoundary />,
        children: [
            { path: Routes.LAUNCH.path, element: <Launch /> },
            { path: Routes.HOME.path, element: <Home /> },
            { path: Routes.FRIEND.path, element: <Friend /> },
            { path: Routes.GROUP.path, element: <Group /> },
            { path: Routes.SAVED.path, element: <Saved /> },
            { path: Routes.VIDEO.path, element: <Video /> },
            { path: Routes.BOOKMARK.path, element: <Bookmark /> },
            { path: Routes.USER.path, element: <User /> },
            { path: Routes.REEL.path, element: <Reel /> },
            { path: Routes.PROFILE.path, element: <Profile /> },
            { path: Routes.POST.path, element: <Post /> },
        ],
    },
]);

const App = () => {
    return (
        <Suspense fallback={<Loading />}>
            <RouterProvider router={routes} />
        </Suspense>
    );
};

export default App;