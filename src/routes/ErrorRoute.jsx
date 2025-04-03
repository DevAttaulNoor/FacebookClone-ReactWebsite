import { useRouteError } from "react-router";
import { Error } from "@pages/general/Error";
import { OuterContainer } from "@layouts/OuterContainer";

export const ErrorRoute = () => {
    const errorData = useRouteError();

    return (
        <OuterContainer>
            <Error errorData={errorData} />
        </OuterContainer>
    );
};