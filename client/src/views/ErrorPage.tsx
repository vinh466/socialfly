import NotFound from "@/components/NotFound";
import { useRouteError } from "react-router-dom";

type RouteError = {
    statusText?: string;
    message?: string;
}

export default function ErrorPage() {
    const error = useRouteError() as RouteError;
    console.error(error);

    return <NotFound />
}