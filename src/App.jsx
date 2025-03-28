// App.js
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Routes } from "./constants/Routes";
import { ErrorRoute } from "./routes/ErrorRoute";
import { Loading } from "./pages/General/Loading";
import { PublicRoute } from "./routes/PublicRoute";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { OuterContainer } from "./layouts/OuterContainer";

const Home = lazy(() => import("./pages/Home"));
const Saved = lazy(() => import("./pages/Saved"));
const Video = lazy(() => import("./pages/Video/Video"));
const Story = lazy(() => import("./pages/Story/Story"));
const Login = lazy(() => import("./pages/Launch/Login"));
const Signup = lazy(() => import("./pages/Launch/Signup"));
const Friend = lazy(() => import("./pages/Friend/Friend"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Story_Create = lazy(() => import("./pages/Story/Story_Create"));

const routes = createBrowserRouter([{
    element: <OuterContainer />,
    errorElement: <ErrorRoute />,
    children: [
        // Public routes (only accessible when not logged in)
        {
            element: <PublicRoute />,
            children: [
                { path: Routes.LOGIN.path, element: <Login /> },
                { path: Routes.SIGNUP.path, element: <Signup /> },
            ],
        },

        // Protected routes (only accessible when logged in)
        {
            element: <ProtectedRoute />,
            children: [
                // Home Page Section Related
                { path: Routes.HOME.path, element: <Home /> },

                // Friends Page Section Related
                { path: Routes.FRIEND.path, element: <Friend /> },
                { path: Routes.FRIEND_AllREQUEST.path, element: <Friend /> },
                { path: Routes.FRIEND_AllFRIENDS.path, element: <Friend /> },

                // Videos Page Section Related
                { path: Routes.VIDEO.path, element: <Video /> },
                { path: Routes.VIDEO_SAVED.path, element: <Video /> },

                // Story Page Section Related
                { path: Routes.STORY.path, element: <Story /> },
                { path: Routes.STORY_CREATE.path, element: <Story_Create /> },

                // Profile Page Section Related
                { path: Routes.PROFILE.path, element: <Profile /> },
                { path: Routes.PROFILE_ABOUT.path, element: <Profile /> },
                { path: Routes.PROFILE_PHOTO.path, element: <Profile /> },
                { path: Routes.PROFILE_VIDEO.path, element: <Profile /> },
                { path: Routes.PROFILE_FRIEND.path, element: <Profile /> },

                // Saved Page Section Related
                { path: Routes.SAVED.path, element: <Saved /> },
            ],
        },
    ]
}]);

const App = () => {
    return (
        <Suspense fallback={<Loading />}>
            <RouterProvider router={routes} />
        </Suspense>
    );
};

export default App;