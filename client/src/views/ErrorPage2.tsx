import { useRouteError } from "react-router-dom";

type RouteError = {
    statusText?: string;
    message?: string;
}

export default function ErrorPage2() {
    const error = useRouteError() as RouteError;
    console.error(error);

    return (
        <div id="error-page">
            <h1>Oops!2222222222</h1>
            <p>Sorry, an unexpected error has occurred.2222222</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}