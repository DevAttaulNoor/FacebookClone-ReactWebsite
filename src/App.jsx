import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Routes } from "@constants/Routes";
import { ErrorRoute } from "@routes/ErrorRoute";
import { Loading } from "@pages/general/Loading";
import { PublicRoute } from "@routes/PublicRoute";
import { AuthProvider } from "@contexts/AuthContext";
import { ProtectedRoute } from "@routes/ProtectedRoute";
import { OuterContainer } from "@layouts/OuterContainer";

const Home = lazy(() => import("./pages/private/Home"));
const Login = lazy(() => import("./pages/public/Login"));
const Saved = lazy(() => import("./pages/private/Saved"));
const Signup = lazy(() => import("./pages/public/Signup"));
const Feed = lazy(() => import("./pages/private/Feed/Feed"));
const Reel = lazy(() => import("./pages/private/Reel/Reel"));
const Video = lazy(() => import("./pages/private/Video/Video"));
const Story = lazy(() => import("./pages/private/Story/Story"));
const Group = lazy(() => import("./pages/private/Group/Group"));
const Friend = lazy(() => import("./pages/private/Friend/Friend"));
const Profile = lazy(() => import("./pages/private/Profile/Profile"));
const Group_Feed = lazy(() => import("./pages/private/Group/Group_Feed"));
const Reel_Create = lazy(() => import("./pages/private/Reel/Reel_Create"));
const Group_Create = lazy(() => import("./pages/private/Group/Group_Create"));
const Story_Create = lazy(() => import("./pages/private/Story/Story_Create"));

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

                // Group Page Section Related
                { path: Routes.GROUP.path, element: <Group /> },
                { path: Routes.GROUP_ABOUT.path, element: <Group /> },
                { path: Routes.GROUP_MEDIA.path, element: <Group /> },
                { path: Routes.GROUP_PEOPLE.path, element: <Group /> },
                { path: Routes.GROUP_FEED.path, element: <Group_Feed /> },
                { path: Routes.GROUP_JOINED.path, element: <Group_Feed /> },
                { path: Routes.GROUP_DISCOVER.path, element: <Group_Feed /> },
                { path: Routes.GROUP_CREATE.path, element: <Group_Create /> },

                // Story Page Section Related
                { path: Routes.STORY.path, element: <Story /> },
                { path: Routes.STORY_CREATE.path, element: <Story_Create /> },

                // Reel Page Section Related
                { path: Routes.REEL.path, element: <Reel /> },
                { path: Routes.REEL_CREATE.path, element: <Reel_Create /> },

                // Feeds Page Section Related
                { path: Routes.FEED.path, element: <Feed /> },
                { path: Routes.FEED_FRIENDS.path, element: <Feed /> },

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
        <AuthProvider>
            <Suspense fallback={<Loading />}>
                <RouterProvider router={routes} />
            </Suspense>
        </AuthProvider>
    );
};

export default App;