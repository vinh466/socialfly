import { isForbiddenError } from "@/services/helper";
import { AnyAction, Middleware, MiddlewareAPI, isRejectedWithValue } from "@reduxjs/toolkit";

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => next => (action: AnyAction) => {
    if (isRejectedWithValue(action)) {
        // console.log(action);
        // if (isForbiddenError(action.payload) && action.payload.status === 403) {
        //     console.log('forbidden');
        //     setTimeout(() => {
        //         api.dispatch(action)
        //     }, 2000);
        // }
    }
    return next(action)
}