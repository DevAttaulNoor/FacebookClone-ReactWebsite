import { OuterContainer } from "@layouts/OuterContainer";
import { Error } from "@pages/General/Error";
import { useRouteError } from "react-router";

export const ErrorRoute = () => {
    const errorData = useRouteError();

    return (
        <OuterContainer>
            <Error errorData={errorData} />
        </OuterContainer>
    );
};