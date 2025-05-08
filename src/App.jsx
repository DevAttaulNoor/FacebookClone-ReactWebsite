import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Loading } from "@pages/general/Loading";
import { AuthProvider } from "@contexts/AuthContext";
import { ContextProviders } from "@contexts/Providers";
import { RouteStructure } from "@routes/RouteStructure";
import { MessageBoxProvider } from "@contexts/MessageBoxContext";

const App = () => {
    return (
        <ContextProviders>
            <Suspense fallback={<Loading />}>
                <RouterProvider router={RouteStructure} />
            </Suspense>
        </ContextProviders>
        // <AuthProvider>
        //     <MessageBoxProvider>
        //         <Suspense fallback={<Loading />}>
        //             <RouterProvider router={RouteStructure} />
        //         </Suspense>
        //     </MessageBoxProvider>
        // </AuthProvider>
    );
};

export default App;