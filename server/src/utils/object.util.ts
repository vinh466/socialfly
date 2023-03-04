export const validateObject = (obj: { [key: string]: any }) => {
    Object.keys(obj).forEach(key => !obj[key] && delete obj[key])
    return obj;
}

export const isEmpty = (obj: any) => {
    return !Object.keys(obj).length;
}