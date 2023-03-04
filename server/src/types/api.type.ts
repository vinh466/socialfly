interface ApiRequest<T, D = { [key: string]: any }> {
    query: T
    meta: D
}

interface ApiResult<T, D = { [key: string]: any }> {
    data: T
    meta: D
}