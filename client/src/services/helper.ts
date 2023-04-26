import { RootState } from "@/store"
import { BaseQueryApi, BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta, fetchBaseQuery } from "@reduxjs/toolkit/dist/query"
import { authAction } from "@/store/auth.slice"
import { localStorageService } from "./localStorage.service"
import { Mutex } from "async-mutex"

export interface ErrorFormObject {
    [key: string | number]: string | ErrorFormObject | ErrorFormObject[]
}

interface EntityError {
    status: 422
    data: ErrorFormObject
}
interface UnauthorizedError {
    status: 401
    data: ErrorFormObject
}
interface ForbiddenError {
    status: 403
    data: ErrorFormObject
}

export const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
    return typeof error === 'object' && error !== null && 'status' in error
}
export const isErrorWithMessage = (error: unknown): error is { data: { message: string } } => {
    return typeof error === 'object' && error !== null && 'message' in error
}
export const isUnauthorizedError = (error: unknown): error is UnauthorizedError => {
    return (
        isFetchBaseQueryError(error) &&
        error.status === 401 &&
        typeof error.data === 'object' &&
        error.data !== null &&
        !(error.data instanceof Array)
    )
}
export const isForbiddenError = (error: unknown): error is ForbiddenError => {
    return isFetchBaseQueryError(error) && error.status === 403
}
export function isEntityError(error: unknown): error is EntityError {
    return (
        isFetchBaseQueryError(error) &&
        error.status === 422 &&
        typeof error.data === 'object' &&
        error.data !== null &&
        !(error.data instanceof Array)
    )
}
const mutex = new Mutex();


export const baseQueryWithReauth = (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
) => async (args: any, api: BaseQueryApi, extraOptions: any) => {
    const baseQuery = fetchBaseQuery({
        baseUrl,
        prepareHeaders: (header, { getState }) => {
            header.set('authorization', (getState() as RootState).auth.accessToken || '')
        }
    })
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 403) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            const refreshToken = localStorageService.getLocalRefreshToken()
            console.log('baseQueryWithReauth rf');
            if (refreshToken) {
                try {
                    const tokenResult = await fetchBaseQuery({
                        baseUrl: '/api/auth',
                        prepareHeaders: (header, { getState }) => {
                            header.set('x-header-token', (getState() as RootState).auth.refreshToken || '')
                        }
                    })({
                        url: '/refreshToken',
                        method: 'POST',
                    }, api, extraOptions)
                    console.log(tokenResult);
                    if (tokenResult) {
                        api.dispatch(authAction.setAccessToken((tokenResult.data as UserRefreshTokenRes).accessToken))
                        result = await baseQuery(args, api, extraOptions);
                    }
                }
                finally {
                    release();
                }
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }

    }

    return result;
};
