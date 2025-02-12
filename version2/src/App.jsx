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

const Login = lazy(() => import("./pages/Launch/Login"));
const Signup = lazy(() => import("./pages/Launch/Signup"));
const Friend = lazy(() => import("./pages/Friend/Friend"));
const Video = lazy(() => import("./pages/Video/Video"));
const Group = lazy(() => import("./pages/Group/Group"));
const Home = lazy(() => import("./pages/Home"));
const Saved = lazy(() => import("./pages/Saved"));
const Bookmark = lazy(() => import("./pages/Bookmark"));
const Reel = lazy(() => import("./pages/Reel"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
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
            // Launch Page Section Related
            { path: Routes.LOGIN.path, element: <Login /> },
            { path: Routes.SIGNUP.path, element: <Signup /> },

            { path: Routes.HOME.path, element: <Home /> },

            // Friends Page Section Related
            { path: Routes.FRIEND.path, element: <Friend /> },
            { path: Routes.FRIEND_AllREQUEST.path, element: <Friend /> },
            { path: Routes.FRIEND_AllFRIENDS.path, element: <Friend /> },

            // Videos Page Section Related
            { path: Routes.VIDEO.path, element: <Video /> },
            { path: Routes.VIDEO_SAVED.path, element: <Video /> },

            // Groups Page Section Related
            { path: Routes.GROUP.path, element: <Group /> },
            { path: Routes.GROUP_LIST.path, element: <Group /> },

            // Profile Page
            { path: Routes.PROFILE.path, element: <Profile /> },
            { path: Routes.PROFILE_ABOUT.path, element: <Profile /> },
            { path: Routes.PROFILE_PHOTO.path, element: <Profile /> },
            { path: Routes.PROFILE_VIDEO.path, element: <Profile /> },
            { path: Routes.PROFILE_FRIEND.path, element: <Profile /> },


            { path: Routes.SAVED.path, element: <Saved /> },
            { path: Routes.VIDEO.path, element: <Video /> },
            { path: Routes.BOOKMARK.path, element: <Bookmark /> },
            { path: Routes.REEL.path, element: <Reel /> },
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
