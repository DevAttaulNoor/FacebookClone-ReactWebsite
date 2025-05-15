import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Loading } from "@pages/general/Loading";
import { ContextProviders } from "@contexts/Providers";
import { RouteStructure } from "@routes/RouteStructure";

const App = () => {
    return (
        <ContextProviders>
            <Suspense fallback={<Loading />}>
                <RouterProvider router={RouteStructure} />
            </Suspense>
        </ContextProviders>
    );
};

export default App;