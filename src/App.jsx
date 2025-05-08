import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Loading } from "@pages/general/Loading";
import { AuthProvider } from "@contexts/AuthContext";
import { RouteStructure } from "@routes/RouteStructure";
import { MessageBoxProvider } from "@contexts/MessageBoxContext";

const App = () => {
    return (
        <AuthProvider>
            <MessageBoxProvider>
                <Suspense fallback={<Loading />}>
                    <RouterProvider router={RouteStructure} />
                </Suspense>
            </MessageBoxProvider>
        </AuthProvider>
    );
};

export default App;